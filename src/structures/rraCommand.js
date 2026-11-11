/**
 * Created by Julian/Wolke on 07.11.2016.
 * Reaction images now come from nekos.best (rra.ram.moe and weeb.sh are gone).
 */
let EventEmitter = require('eventemitter3');
let axios = require('axios');
let winston = require("winston");

// commands whose old image type has no nekos.best category
const typeMap = {
    nyan: 'neko',
    lick: 'bleh',
    lewd: 'blush',
    owo: 'teehee',
    triggered: 'angry',
    rem: 'waifu'
};

/**
 * The base command class for reaction images
 * @extends EventEmitter
 *
 */
class Command extends EventEmitter {
    constructor() {
        super();
    }

    /**
     * The main function of the command
     * @param {Object} msg
     */
    async run(msg) {
        try {
            let type = this.imageType || typeMap[this.cmd] || this.cmd;
            let res = await axios.get(`https://nekos.best/api/v2/${type}`, {timeout: 10000});
            let image = res.data.results[0];
            let embed = {image: {url: image.url}, color: 0x00ADFF};
            if (msg.mentions && msg.mentions.length > 0) {
                let targets = msg.mentions.map(u => `**${u.username}**`).join(', ');
                embed.description = `**${msg.author.username}** ➜ ${targets}`;
            }
            if (image.anime_name || image.artist_name) {
                embed.footer = {text: image.anime_name || `Art by ${image.artist_name}`};
            }
            return msg.channel.createMessage({embed});
        } catch (e) {
            winston.error(e.message);
            return msg.channel.createMessage(this.t('generic.error', {lngs: msg.lang}));
        }
    }
}

module.exports = Command;
