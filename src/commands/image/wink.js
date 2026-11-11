let RRACommand = require('../../structures/rraCommand');
class WinkImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'wink';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Wink at someone', usage: '{{prefix}}wink [@user]'};
    }
}
module.exports = WinkImage;
