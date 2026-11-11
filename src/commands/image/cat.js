/**
 * Created by Julian/Wolke on 07.11.2016.
 */
let Command = require('../../structures/command');
let winston = require('winston');
let axios = require('axios');
class Cat extends Command {
    constructor({t}) {
        super();
        this.cmd = 'cat';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
    }

    async run(msg) {
        try {
            let req = await axios.get('https://api.thecatapi.com/v1/images/search', {timeout: 10000});
            msg.channel.createMessage({embed: {image: {url: req.data[0].url}, color: 0x00ADFF}});
        } catch (e) {
            winston.error(e);
            msg.channel.createMessage(this.t('generic.error', {lngs: msg.lang}));
        }
    }
}
module.exports = Cat;