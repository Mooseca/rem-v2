let RRACommand = require('../../structures/rraCommand');
class SleepImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'sleep';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'Go to sleep', usage: '{{prefix}}sleep [@user]'};
    }
}
module.exports = SleepImage;
