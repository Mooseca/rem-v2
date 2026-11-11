let RRACommand = require('../../structures/rraCommand');
class BonkImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'bonk';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Bonk someone', usage: '{{prefix}}bonk [@user]'};
    }
}
module.exports = BonkImage;
