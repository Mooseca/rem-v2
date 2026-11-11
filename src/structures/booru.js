/**
 * Fetches a random post from an image board, dropping posts with blocked tags.
 */
const axios = require('axios');

const userAgent = 'RemBot/2.0 (https://github.com/Mooseca/rem-v2)';

/**
 * @param {Object} opts
 * @param {String} opts.url - post list endpoint
 * @param {String} opts.tags - search tags
 * @param {Array} opts.filter - blocked terms
 * @param {Function} [opts.posts] - picks the post array out of the response
 * @param {Function} [opts.postTags] - returns a post's tags as one string
 * @param {Function} [opts.fileUrl] - returns a post's image url
 * @returns {Promise<String|null>} image url, or null when nothing matched
 */
async function randomPost(opts) {
    let res = await axios.get(opts.url, {
        params: {limit: 100, tags: opts.tags},
        headers: {'User-Agent': userAgent},
        timeout: 15000
    });
    let posts = opts.posts ? opts.posts(res.data) : res.data;
    let postTags = opts.postTags || (p => p.tags);
    let fileUrl = opts.fileUrl || (p => p.file_url);
    posts = (posts || []).filter(p => {
        let tags = postTags(p);
        return typeof tags === 'string' && fileUrl(p) && !opts.filter.some(f => tags.indexOf(f) > -1);
    });
    if (posts.length === 0) {
        return null;
    }
    return fileUrl(posts[Math.floor(Math.random() * posts.length)]);
}

module.exports = {randomPost};
