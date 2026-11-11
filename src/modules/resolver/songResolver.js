/**
 * Created by Julian on 17.03.2017.
 */
let youtube = require('./youtubeResolver');
let soundcloud = require('./soundCloudResolver');
let twitch = require('./twitchResolver');
let youtubePlaylist = require('./youtubePlaylistResolver');
const winston = require('winston');
let crypto = require('crypto');
let Cache;
let searchCache;
if (remConfig.redis_enabled) {
    Cache = require('./../../structures/redisCache');
    winston.debug('Using Redis Cache for Searches!');
} else {
    Cache = require('./../../structures/cache');
    searchCache = Cache;
    winston.debug('Using Map Cache for Searches!');
}
let ytdlp = require('../audio/ytdlp');
const SEARCH_RESULTS = 10;
class SongResolver {
    constructor(redis) {
        this.redis = redis;
        this.resolvers = {youtube, soundcloud, twitch};
        this.playlistResolvers = {youtubePlaylist};
        if (remConfig.redis_enabled) {
            searchCache = new Cache(redis);
        }
    }

    checkUrl(url) {
        url = this.removeBracket(url);
        for (let resolver in this.resolvers) {
            if (this.resolvers.hasOwnProperty(resolver)) {
                if (this.resolvers[resolver].canResolve(url)) {
                    return true;
                }
            }
        }
        return false;
    }

    async resolve(url) {
        url = this.removeBracket(url);
        for (let resolver in this.resolvers) {
            if (this.resolvers.hasOwnProperty(resolver)) {
                if (this.resolvers[resolver].canResolve(url)) {
                    return this.resolvers[resolver].resolve(url);
                }
            }
        }
    }

    checkUrlPlaylist(url) {
        url = this.removeBracket(url);
        for (let resolver in this.playlistResolvers) {
            if (this.playlistResolvers.hasOwnProperty(resolver)) {
                if (this.playlistResolvers[resolver].canResolve(url)) {
                    return true;
                }
            }
        }
        return false;
    }

    async resolvePlaylist(url) {
        url = this.removeBracket(url);
        for (let resolver in this.playlistResolvers) {
            if (this.playlistResolvers.hasOwnProperty(resolver)) {
                if (this.playlistResolvers[resolver].canResolve(url)) {
                    return this.playlistResolvers[resolver].resolve(url);
                }
            }
        }
        throw new TranslatableError({t: 'generic.error', message: 'This playlist is not supported.'});
    }

    async search(search) {
        let searchHash = crypto.createHash('md5').update(search).digest('hex');
        winston.debug(`Generated Hash ${searchHash} for search term: ${search}`);
        // console.log(searchHash);
        let results = await searchCache.get(`youtube_search_${searchHash}`);
        if (results) {
            winston.debug(`Found Search with hash ${searchHash} in Cache!`);
            winston.debug(`Results: ${results}`);
            // console.log(results);
            return results;
        } else {
            let res = await ytdlp.getInfo(`ytsearch${SEARCH_RESULTS}:${search}`, ['--flat-playlist']);
            let entries = (res.entries || []).filter((e) => e && e.id);
            if (entries.length > 0) {
                let actualResult = entries.map((item) => {
                    return {
                        id: item.id,
                        url: `https://youtube.com/watch?v=${item.id}`,
                        title: item.title
                    }
                });
                await searchCache.set(`youtube_search_${searchHash}`, actualResult);
                return actualResult;
            } else {
                throw new TranslatableError({t: 'generic.error', message: 'empty search returned!'});
            }
        }
    }

    removeBracket(url) {
        if (url.startsWith('<')) {
            url = url.substr(1);
        }
        if (url.endsWith('>')) {
            url = url.substr(0, url.length - 1);
        }
        return url;
    }
}
module.exports = SongResolver;