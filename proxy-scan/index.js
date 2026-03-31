const fs = require('fs');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const readline = require('readline');

// Các nguồn chia sẻ proxy miễn phí (HTTP/HTTPS) cập nhật hàng ngày trên mạng (Github, v.v.)
const PROXY_SOURCES = [
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt', // có thể lẫn lộn nhưng bot sẽ tự check
    'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt',
    'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
    'https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt'
];

const MAX_TIMEOUT = 15000; // 15 seconds
const OUTPUT_FILE = 'live_proxies.txt';
// Định dạng xuất ra theo yêu cầu: http://user:pass@ip:port (nếu không có user pass thì ghi http://ip:port)

async function fetchProxies() {
    console.log('Đang bắt đầu crawl proxy từ mạng (github, proxy share)...');
    let proxySet = new Set();
    
    for (const source of PROXY_SOURCES) {
        try {
            console.log(`- Đang lấy từ: ${source}`);
            const response = await axios.get(source, { timeout: 10000 });
            const lines = response.data.split('\n');
            let count = 0;
            
            lines.forEach(line => {
                const proxy = line.trim();
                // Lọc cơ bản định dạng ip:port hoặc user:pass@ip:port
                if (proxy.length > 8 && proxy.includes(':')) {
                    // Loại bỏ các dòng là html hay rác
                    if (!proxy.includes('<') && !proxy.includes(' ') && !proxy.startsWith('#')) {
                        proxySet.add(proxy);
                        count++;
                    }
                }
            });
            console.log(`  -> Lấy thành công ${count} proxy.`);
        } catch (error) {
            console.log(`  -> Lỗi khi lấy: ${error.message}`);
        }
    }
    
    const proxies = Array.from(proxySet);
    console.log(`\nTổng cộng thu thập được: ${proxies.length} proxies.`);
    return proxies;
}

// Hàm kiểm tra 1 proxy
async function checkProxy(proxyStr) {
    // Nếu proxyStr có dạng user:pass@ip:port hoặc ip:port
    const proxyUrl = proxyStr.startsWith('http://') || proxyStr.startsWith('https://') 
        ? proxyStr 
        : `http://${proxyStr}`;

    const agent = new HttpsProxyAgent(proxyUrl);
    const start = Date.now();

    try {
        // Gọi đến 1 HTTP endpoint đáng tin cậy để test (ipify)
        const response = await axios.get('https://api.ipify.org?format=json', {
            httpsAgent: agent,
            timeout: MAX_TIMEOUT,
            validateStatus: status => status === 200
        });

        const duration = Date.now() - start;
        
        // Nếu thành công và nhỏ hơn 15000ms
        if (duration < MAX_TIMEOUT) {
            return { valid: true, proxyStr: proxyStr, time: duration };
        }
    } catch (error) {
        // Catch các lỗi do proxy hỏng, timeout,...
    }
    return { valid: false };
}

async function main() {
    const proxies = await fetchProxies();
    
    if (proxies.length === 0) {
        console.log('Không lấy được proxy nào để kiểm tra.');
        return;
    }

    console.log(`\nBắt đầu kiểm tra xem proxy còn hoạt động và ping < ${MAX_TIMEOUT}ms không...`);
    
    // Xoá nội dung file cũ hoặc tạo file mới
    fs.writeFileSync(OUTPUT_FILE, '', 'utf8');

    let workingProxiesCount = 0;
    
    // Quản lý số luồng chạy đồng thời (concurrency) để không sập RAM/mạng
    const CONCURRENCY = 150; 
    let activeChecks = 0;
    let index = 0;

    return new Promise((resolve) => {
        function next() {
            if (index >= proxies.length && activeChecks === 0) {
                console.log(`\nHoàn thành! Bạn có thể xem danh sách tại file: ${OUTPUT_FILE}`);
                resolve();
                return;
            }

            while (activeChecks < CONCURRENCY && index < proxies.length) {
                const proxyStr = proxies[index++];
                activeChecks++;

                checkProxy(proxyStr).then(result => {
                    if (result.valid) {
                        workingProxiesCount++;
                        // Định dạng mong muốn: http://user:pass@ip:port hoặc http://ip:port
                        const formattedProxy = result.proxyStr.startsWith('http') 
                            ? result.proxyStr 
                            : `http://${result.proxyStr}`;
                        
                        fs.appendFileSync(OUTPUT_FILE, `${formattedProxy}\n`, 'utf8');
                        
                        // Hiển thị trực tiếp (làm mới console)
                        process.stdout.write(`\r[LIVE] ${formattedProxy} - ${result.time}ms | Tổng đã tìm thấy: ${workingProxiesCount}     \n`);
                    } else {
                        // Hiển thị tiến độ (ghi đè dòng hiện tại)
                        process.stdout.write(`\rĐang quét... (${index}/${proxies.length}) - Live: ${workingProxiesCount}`);
                    }
                    activeChecks--;
                    next();
                });
            }
        }
        next();
    });
}

main();
