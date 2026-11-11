let RRACommand = require('../../structures/rraCommand');
class SaluteImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'salute';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Salute', usage: '{{prefix}}salute [@user]'};
    }
}
module.exports = SaluteImage;
