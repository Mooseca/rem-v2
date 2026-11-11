let RRACommand = require('../../structures/rraCommand');
class HighfiveImage extends RRACommand {
    constructor({t}) {
        super();
        this.cmd = 'highfive';
        this.cat = 'image';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {short: 'High five someone', usage: '{{prefix}}highfive [@user]'};
    }
}
module.exports = HighfiveImage;
