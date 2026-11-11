let RRACommand = require('../../structures/rraCommand');
class DanceImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'dance';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Dance!', usage: '{{prefix}}dance [@user]'};
    }
}
module.exports = DanceImage;
