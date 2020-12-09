const axios = require('axios');
const { google } = require('googleapis');
const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
});
const ytdl = require('ytdl-core');

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
        const result = await youtube.playlistItems.list({
            part: 'snippet',
            playlistId,
            type: 'video',
        });
        const playlist = await youtube.playlists.list({
            part: 'snippet',
            id: playlistId
        });
        const title = playlist.data.items[0].snippet.title;
        return {
            title,
            items: result.data.items,
        };
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
        throw err;
    }
}

async function getVideoInfo(videoId) {
    try {
        const result = await youtube.videos.list({
            part: 'snippet,contentDetails',
            id: videoId
        });
        let info;
        try {
            info = await ytdl.getInfo(videoId);
            result.data.items[0].media = info.videoDetails.media;
        } catch(err) {}
        return result.data.items;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getPlaylistVideos,
    getVideoInfo,
    searchPlaylist,
    searchVideo,
}
