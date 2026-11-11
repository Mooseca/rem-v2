let RRACommand = require('../../structures/rraCommand');
class BakaImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'baka';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Call someone a baka', usage: '{{prefix}}baka [@user]'};
    }
}
module.exports = BakaImage;
