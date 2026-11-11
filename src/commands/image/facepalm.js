let RRACommand = require('../../structures/rraCommand');
class FacepalmImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'facepalm';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Facepalm', usage: '{{prefix}}facepalm [@user]'};
    }
}
module.exports = FacepalmImage;
