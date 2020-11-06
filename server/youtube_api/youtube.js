const { google } = require('googleapis');
const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
});

async function searchPlaylist(searchQuery, maxResults) {
    try {
        const result = await youtube.search.list({
            part: 'id,snippet',
            q: `${searchQuery}`,
            type: 'playlist',
            maxResults,
        });
        return result.data.items;
    } catch (err) {
        console.log(err);
    }
}

async function getPlaylistVideos(playlistId) {
    try {
        const result = await youtube.search.list({
            part: 'id,snippet',
            playlistId,
            type: 'playlistItems',
            topicId: 'Music'
        });
        return result.data.items;
    } catch(err) {
        console.log(err);
    }
}

async function searchVideo(searchQuery, maxResults) {
    try {
        const result = await youtube.search.list({
            part: 'id,snippet',
            q: searchQuery,
            type: 'video',
            videoCategoryId: 10,
            maxResults,
        });
        return result.data.items;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getPlaylistVideos,
    searchPlaylist,
    searchVideo,
}
