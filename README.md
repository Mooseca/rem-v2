# Rem

A Discord music and fun bot, originally by [DasWolke](https://github.com/DasWolke/rem-v2), brought back to life in 2026.

## What works

- **Music**: YouTube (videos, playlists, search), SoundCloud, Twitch and direct links through yt-dlp, plus the listen.moe radio. Voice runs on `@discordjs/voice`, so it supports Discord's current voice encryption.
- **Reactions**: hug, kiss, pat, cuddle, slap, wave, bonk, highfive and more from [nekos.best](https://nekos.best). Mention someone to aim it at them.
- **Images**: cat (TheCatAPI), dog (random.dog), waifu, neko, kitsune, husbando.
- **Lookups**: anime, manga and characters from AniList, `define` from Urban Dictionary.
- **NSFW** (NSFW channels only): yandere, e621, konachan.
- **Chat**: mention the bot to talk to it. Needs any OpenAI-compatible API, such as Ollama (see below). Off unless configured.
- Moderation, permissions, greetings, prefixes and languages as before.

Removed because the services behind them are gone: garfield, gtn, ibsafe, yui, and the osu! beatmap downloader.

## Running with Docker

1. Create a bot at the [Discord developer portal](https://discord.com/developers/applications). Under **Bot**, turn on the **Message Content** and **Server Members** intents.
2. `git submodule update --init` (translations).
3. `cp config/main.example.json config/main.json` and fill in `token`, `owner_id`, `client_id` and `bot_id`.
4. `docker compose up -d --build`

This starts Rem with MongoDB 7 and Redis. yt-dlp updates itself each time the container starts, which keeps YouTube working.

Invite the bot with the link from its `invite` command, or
`https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&permissions=3271750`.

## Running without Docker

Needs Node 22+, MongoDB, Redis, ffmpeg and yt-dlp on the PATH (or set `FFMPEG_PATH` / `YTDLP_PATH`).
Point `mongo_hostname` and `redis_hostname` in `config/main.json` at your servers, then:

```
npm install
npm start
```

## Chat setup

Add these to `config/main.json`:

```json
"chat_api_url": "http://your-ollama-host:11434/v1",
"chat_model": "llama3.2",
"chat_api_key": ""
```

`chat_system_prompt` changes the personality. The last 10 messages per channel are kept as context. Permission node: `fun.cleverbot`.
