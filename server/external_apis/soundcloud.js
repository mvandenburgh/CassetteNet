const soundcloud = require('soundcloud-downloader').default;

async function searchSong(song, page) {
    let query = song;
    if (page) {
        query = `?q=${query}&offset=${(page-1)*10}&limit=${(page-1)*10}`
    }
    const songs = await soundcloud.search('tracks', `q=${query}`);
    return songs.collection;
}

async function getSongInfo(songId) {
    const songInfo = await soundcloud.getTrackInfoByID([songId]);
    if (songInfo.length === 1) {
        return songInfo[0];
    } else {
        return null;
    }
}

async function streamSongAudio(songId) {
    const stream = await soundcloud.download(`https://api.soundcloud.com/tracks/${songId}`);
    return stream;
}

module.exports = {
    getSongInfo,
    searchSong,
    streamSongAudio,
}
