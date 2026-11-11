let RRACommand = require('../../structures/rraCommand');
class WaifuImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'waifu';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'A random waifu picture', usage: '{{prefix}}waifu [@user]'};
    }
}
module.exports = WaifuImage;
