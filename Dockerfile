FROM node:22-bookworm-slim
LABEL maintainer="Mooseca"
# ffmpeg plays the audio, yt-dlp fetches YouTube/SoundCloud/Twitch, the build tools are for @discordjs/opus
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg python3 python3-pip ca-certificates build-essential git \
    && pip3 install --no-cache-dir --break-system-packages yt-dlp \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/rem
COPY package.json /usr/src/rem/
RUN npm install --omit=dev --no-audit --no-fund
COPY . /usr/src/rem
RUN mkdir -p audio temp config
WORKDIR /usr/src/rem/src
# yt-dlp has to keep up with YouTube, so update it on every start
CMD ["sh", "-c", "pip3 install -q -U --break-system-packages yt-dlp >/dev/null 2>&1; exec node index.js"]
