/**
 * Small client for the AniList GraphQL API (the old v1 REST API is gone).
 * Results are mapped to the field names the anime/manga/character commands were written for.
 */
const axios = require('axios');

async function query(gql, variables) {
    let res = await axios.post('https://graphql.anilist.co', {query: gql, variables}, {timeout: 15000});
    return res.data.data;
}

function splitName(name) {
    let parts = (name.full || '').split(' ');
    return {name_first: parts.shift() || '', name_last: parts.join(' ') || null};
}

/**
 * Searches anime or manga
 * @param {String} type - ANIME or MANGA
 * @param {String} search
 * @returns {Promise<Array>}
 */
async function searchMedia(type, search) {
    let data = await query(`query ($search: String, $type: MediaType) {
        Page(perPage: 10) {
            media(search: $search, type: $type, sort: SEARCH_MATCH) {
                id title { romaji english } description averageScore genres episodes chapters
                coverImage { extraLarge large }
                characters(role: MAIN, perPage: 10) { nodes { id name { full } } }
            }
        }
    }`, {search, type});
    return data.Page.media.map(m => ({
        id: m.id,
        title_romaji: m.title.romaji,
        title_english: m.title.english || m.title.romaji,
        description: m.description || '',
        average_score: m.averageScore || '?',
        genres: m.genres || [],
        total_episodes: m.episodes || 0,
        total_chapters: m.chapters || 0,
        image_url_lge: m.coverImage.extraLarge || m.coverImage.large,
        characters: m.characters.nodes.map(c => Object.assign({id: c.id, role: 'Main'}, splitName(c.name)))
    }));
}

async function searchCharacters(search) {
    let data = await query(`query ($search: String) {
        Page(perPage: 15) {
            characters(search: $search, sort: SEARCH_MATCH) {
                id name { full native } description image { large }
            }
        }
    }`, {search});
    return data.Page.characters.map(c => Object.assign({
        id: c.id,
        name_japanese: c.name.native,
        info: c.description || '',
        image_url_lge: c.image.large
    }, splitName(c.name)));
}

module.exports = {searchMedia, searchCharacters};
