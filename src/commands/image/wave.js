let RRACommand = require('../../structures/rraCommand');
class WaveImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'wave';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Wave at someone', usage: '{{prefix}}wave [@user]'};
    }
}
module.exports = WaveImage;
