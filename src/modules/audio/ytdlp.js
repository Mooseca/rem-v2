/**
 * Small helper around the yt-dlp program, which replaces ytdl-core,
 * youtube-dl and the YouTube Data API.
 */
const child_process = require('child_process');
const YTDLP = process.env.YTDLP_PATH || 'yt-dlp';

/**
 * Runs yt-dlp and returns its parsed JSON output
 * @param {String} url - an url or a search like ytsearch10:term
 * @param {Array} [extraArgs]
 * @returns {Promise<Object>}
 */
function getInfo(url, extraArgs = []) {
    return new Promise((resolve, reject) => {
        const args = ['-J', '--no-warnings', '--skip-download', ...extraArgs, url];
        child_process.execFile(YTDLP, args, {maxBuffer: 64 * 1024 * 1024, timeout: 60000}, (err, stdout, stderr) => {
            if (err) {
                return reject(new Error(`yt-dlp failed: ${(stderr || err.message).toString().trim()}`));
            }
            try {
                resolve(JSON.parse(stdout));
            } catch (e) {
                reject(e);
            }
        });
    });
}

module.exports = {getInfo};
