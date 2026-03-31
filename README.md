# TitanNode Auto Bot

An automatic bot to connect to the Titan Network node extension and earn points (TNTIP) continuously. Built with Node.js, this bot supports proxies and is designed to run 24/7.

---

## ✨ Features

- **Full Automation**: Just run it, and the bot will handle the rest.
- **Token Management**: Automatically refreshes the access token to keep the session active.
- **Proxy Support**: Run multiple bots simultaneously using a proxy list from `proxies.txt`.
- **Direct Mode**: If no proxies are provided, the bot will run using your main internet connection.
- **Secure**: Safely stores your refresh token in a `.env` file.
- **Random User-Agent**: Uses a random user-agent for each connection to appear more natural.

---

## ⚙️ Installation on VPS (Ubuntu)

### 1. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # Confirm v18+
```

### 2. Clone the Repository

```bash
git clone https://github.com/Cuongder/TitanNode-Auto-Bot.git
cd TitanNode-Auto-Bot
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure

```bash
cp .env.example .env   # Or create .env manually
nano .env
```

Add your credentials:

```env
USER_ID=your_email@gmail.com
PASS=your_password
```

> With this setup, the bot will **automatically re-login** whenever the token expires, so it can run 24/7 without manual intervention.

(Optional) Add proxies:

```bash
nano proxies.txt
```

```txt
# Format: http://[user:password@]host:port
http://user1:pass1@proxy1.com:8080
socks5://user3:pass3@proxy3.com:1080
```

### 5. Install PM2 & Run

```bash
npm install -g pm2
pm2 start index.js --name "titan-bot"
pm2 startup    # Auto-start on system boot
pm2 save       # Save current process list
```

### PM2 Useful Commands

| Command | Description |
|---|---|
| `pm2 logs titan-bot` | View logs |
| `pm2 stop titan-bot` | Stop the bot |
| `pm2 restart titan-bot` | Restart the bot |
| `pm2 status` | Check bot status |
| `pm2 monit` | Monitor CPU/RAM |

---

## 🔄 Update to Latest Version

When a new version is available, run these commands on your VPS:

```bash
cd ~/TitanNode-Auto-Bot
pm2 stop titan-bot
git pull origin main
npm install
pm2 restart titan-bot
```

> **Note:** Your `.env` and `proxies.txt` files will NOT be overwritten during update (they are in `.gitignore`).

---

## ⚠️ Disclaimer

This application is created for educational purposes. The use of bots may violate the terms and conditions of the Titan Network. Use at your own risk. The developer is not responsible for any account suspension or other losses.
