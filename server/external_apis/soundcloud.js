const soundcloud = require('soundcloud-downloader');

async function searchSong(song) {
    const songs = await soundcloud.search('tracks', song);
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
