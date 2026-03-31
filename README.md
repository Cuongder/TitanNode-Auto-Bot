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

## ⚙️ Installation

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/vikitoshi/TitanNode-Auto-Bot.git](https://github.com/vikitoshi/TitanNode-Auto-Bot.git)
    cd TitanNode-Auto-Bot
    ```

2.  **Install Dependencies**
    Make sure you have [Node.js](https://nodejs.org/) version 18 or higher.
    ```bash
    npm install
    ```

---

## 🔧 Configuration

Before running the bot, you need to complete the following configuration:

### 1. Login Credentials (`.env`) — Recommended

Add your Titan Network email and password to the `.env` file. The bot will automatically login and obtain tokens when needed.

```env
USER_ID=your_email@gmail.com
PASS=your_password
```

> With this setup, the bot will **automatically re-login** whenever the token expires, so it can run 24/7 without manual intervention.

### 2. Refresh Token (`.env`) — Optional

You can optionally provide a `REFRESH_TOKEN`. The bot will try to use it first. If it expires, the bot falls back to login with `USER_ID`/`PASS` and saves the new refresh token back to `.env` automatically.

```env
REFRESH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **How to get `REFRESH_TOKEN`**: Log in to the [Titan Dashboard](https://edge.titannet.info/signup?inviteCode=X3X2TJ3A), open Developer Tools (F12) -> Application -> Local Storage, find `titan-edge-user-info`, and copy the value from `refresh_token`.

### 3. Proxies (`proxies.txt`) — Optional

If you want to use proxies:

1.  Create a `proxies.txt` file in the main directory.
2.  Enter your proxy list, one proxy per line. The bot will create a connection for each proxy listed.
    ```txt
    # Format: http://[user:password@]host:port
    http://user1:pass1@proxy1.com:8080
    http://user2:pass2@proxy2.com:8080
    socks5://user3:pass3@proxy3.com:1080
    ```
    If the `proxies.txt` file is empty or does not exist, the bot will run in direct mode (without proxies).

---

## 🚀 Running the Bot

### Regular Run

After the configuration is complete, run the bot with the following command:

```bash
npm start
```

### Running with PM2 (Background Execution)

To keep the bot running in the background and automatically restart upon system reboots, you can use PM2:

1.  **Install PM2 globally** (if you haven't already):
    ```bash
    npm install -g pm2
    ```

2.  **Start the bot with PM2**:
    ```bash
    pm2 start index.js --name "titan-bot"
    ```

3.  **Useful Commands**:
    - View logs: `pm2 logs titan-bot`
    - Stop the bot: `pm2 stop titan-bot`
    - Restart the bot: `pm2 restart titan-bot`
    - Start automatically on system boot: `pm2 startup` and `pm2 save`

The bot will start the connection, display the status, and begin collecting points for you.

---

## ⚠️ Disclaimer

This application is created for educational purposes. The use of bots may violate the terms and conditions of the Titan Network. Use at your own risk. The developer is not responsible for any account suspension or other losses.
