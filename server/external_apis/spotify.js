const SpotifyWebApi = require('spotify-web-api-node');
const { getVideoInfo } = require('../external_apis/youtube');
const { parse, toSeconds } = require('iso8601-duration');

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

const spotifyApi = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
});

spotifyApi.clientCredentialsGrant().then(data => spotifyApi.setAccessToken(data.body['access_token']));


async function getAudioAnalysisFromSpotify(trackId) {
    const analysis = await spotifyApi.getAudioAnalysisForTrack(trackId);
    return analysis;
}

async function getAudioAnalysisFromYoutube(videoId) {
    const vidInfo = await getVideoInfo(videoId);
    let tracks;
    if (vidInfo[0].media && vidInfo[0].media.song && vidInfo[0].media.artist) {
        tracks = await spotifyApi.searchTracks(`track:${vidInfo[0].media.song} artist:${vidInfo[0].media.artist}`);
    } else {
        tracks = await spotifyApi.searchTracks(vidInfo[0].snippet.title);
    }
    if (!tracks.body || !tracks.body.tracks.items) {
        return null;
    }

    const durationFromYt = toSeconds(parse(vidInfo[0].contentDetails.duration));
    let track;

    // try to find spotify track with best chance of being identical to youtube track
    for (let i = 0; i < tracks.body.tracks.items.length; i++) {
        let currentDuration = tracks.body.tracks.items[i].duration_ms / 1000;
        if (Math.abs(durationFromYt - currentDuration) <= 10) {
            track = tracks.body.tracks.items[i].id;
            break;
        }
    }
    if (!track) {
        return null;
    }
    const analysis = await spotifyApi.getAudioAnalysisForTrack(track);
    if (analysis.body.track.codestring) {
        delete analysis.body.track.codestring;
    }
    if (analysis.body.track.echoprintstring) {
        delete analysis.body.track.echoprintstring;
    }
    if (analysis.body.track.rhythmstring) {
        delete analysis.body.track.rhythmstring;
    }
    if (analysis.body.track.synchstring) {
        delete analysis.body.track.synchstring;
    }
    if (analysis.body.track.segments) {
        delete analysis.body.track.segments;
    }
    if (analysis.body.track.tatums) {
        delete analysis.body.track.tatums;
    }
    return analysis.body;
}

module.exports = {
    getAudioAnalysisFromSpotify,
    getAudioAnalysisFromYoutube,
}

