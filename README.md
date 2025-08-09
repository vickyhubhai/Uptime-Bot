# Uptime Bot (Discord.js v14)

A Discord bot with URL uptime tracking, Express keepalive server, and persistent storage using quick.db v9+.

## Features
- Add, remove, and list your monitored URLs
- Admin command to list all URLs
- Express web server with `/ping` endpoint for uptime monitoring
- Self-pinging keepalive to prevent idling
- Compatible with Discord.js v14, quick.db v9+, and Node.js 18+

## Setup

### 1. Clone & Install
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```
token=YOUR_DISCORD_BOT_TOKEN
PORT=3000
```
Replace `YOUR_DISCORD_BOT_TOKEN` with your actual Discord bot token.

### 3. Start the Bot
```bash
npm start
```

### 4. (Optional) Start Keepalive Server
If you want a separate endpoint for external uptime pings:
```bash
npm run keepalive
```

## Bot Commands
- `-help` — Show command list
- `-set <url>` — Add a URL to your list
- `-my-urls` — List all your URLs
- `-remove <url>` — Remove a URL from your list
- `-clear-all` — Remove all your URLs
- `-all-urls` — (Admin only) List all URLs in the database
- `-ping` — Pong!
- `-ms` — Check bot latency

## Hosting
- The Express server binds to the port set in the `PORT` environment variable (default: 3000).
- For 24/7 uptime, use an external uptime service (UptimeRobot, BetterStack, etc.) to ping `/ping`.
- You can run both the bot and keepalive server together for redundancy.

## Dependencies
- discord.js@^14
- quick.db@^9
- express
- dotenv
- ms
- better-sqlite3

## License
MIT
