let RRACommand = require('../../structures/rraCommand');
class BlushImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'blush';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Blush', usage: '{{prefix}}blush [@user]'};
    }
}
module.exports = BlushImage;
