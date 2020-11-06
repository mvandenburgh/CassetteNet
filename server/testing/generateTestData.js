const axios = require('axios');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const { uintToBase36 } = require('base36id');
const { getPlaylistVideos } = require('../youtube_api/youtube');

const NUM_OF_USERS = 300;
const NUM_OF_MIXTAPES = 9;

const MIN_COLLABORATORS_PER_MIXTAPE = 10;
const MAX_COLLABORATORS_PER_MIXTAPE = 20;

const MIN_FAVORITED_MIXTAPES_PER_USER = 0;
const MAX_FAVORITED_MIXTAPES_PER_USER = 5;

const MIN_FOLLOWED_USERS_PER_USER = 0;
const MAX_FOLLOWED_USERS_PER_USER = 7;

const MIN_ANONYMOUS_INBOX_MESSAGES_PER_USER = 0;
const MAX_ANONYMOUS_INBOX_MESSAGES_PER_USER = 5;

if (MAX_COLLABORATORS_PER_MIXTAPE > NUM_OF_USERS) throw new Error('Max collaborators must be less than number of existing users');


const SAMPLE_PLAYLISTS = [
    'PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG',
    'PLNSvUjadUIVCNXxRsoSXrlsJQSWLzBwYA',
    'PLQHnNscWoAtw-wxC3kQhYVHe4j7LGlNFD',
];

/**
 * Function to generate a fake MongoDB object ID.
 * Source - https://stackoverflow.com/a/37438675
 */
const ObjectId = (
    m = Math,
    d = Date,
    h = 16,
    s = (s) => m.floor(s).toString(h)
) => s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const randInt = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));

// returns true or false randomly
const coinFlip = () => Boolean(randInt(0,2));


async function generateMixtapes(count) {
    const mixtapes = [];
    for (let i = 0; i < count; i++) {
        if (i >= SAMPLE_PLAYLISTS.length) break;
        let songs = [];
        let playlistId = SAMPLE_PLAYLISTS[i];
        try {
            const playlist = await getPlaylistVideos(playlistId);
            songs = playlist.items
                    .filter(entry => entry.snippet.resourceId.kind === 'youtube#video')
                    .map(entry => ({
                        name: entry.snippet.title,
                        id: entry.snippet.resourceId.videoId,
                        coverImage: entry.snippet.thumbnails.default.url,
                    })
            );
            const isPublic = coinFlip();
            mixtapes.push({
                _id: ObjectId(),
                name: playlist.title,
                collaborators: [],
                songs,
                isPublic,
            })
        } catch (err) {
            console.log(err);
        }
    }
    return mixtapes;
}


async function generateUsers(count) {
    const users = [];
    let current_unique_id = 0;
    const res = await axios.get(`https://randomuser.me/api/?results=${count}`);
    for (const user of res.data.results) {
        const { username } = user.login;
        const password = 'password';
        const { email } = user;
        const verified = true;
        const favoritedMixtapes = [];
        const followedUsers = [];
        const admin = false;
        current_unique_id++;
        users.push({
            _id: ObjectId(),
            username,
            password,
            email,
            verified,
            favoritedMixtapes,
            followedUsers,
            admin,
            uniqueId: current_unique_id,
        });
    }
    return users;
}

async function generateTestData() {
    const mixtapes = await generateMixtapes(NUM_OF_MIXTAPES);
    const users = await generateUsers(NUM_OF_USERS);
    const inboxMessages = []; // to be filled in later

    for (const mixtape of mixtapes) {
        // GENERATE MIXTAPE COLLABORATORS
        if (coinFlip()) {
            const collaborators = new Set();
            for (let i = 0, end = randInt(MIN_COLLABORATORS_PER_MIXTAPE, MAX_COLLABORATORS_PER_MIXTAPE); i < end; i++) {
                collaborators.add(users[randInt(0, users.length)]._id);
            }
            mixtape.collaborators = Array.from(collaborators);
            if (mixtape.collaborators.length === 0) {
                mixtape.collaborators.push(users[randInt(0, users.length)]._id);
            }
            mixtape.collaborators[0] = { user: mixtape.collaborators[0], permissions: 'owner' };
            for (let i = 1; i < mixtape.collaborators.length; i++) {
                mixtape.collaborators[i] = { user: mixtape.collaborators[i], permissions: coinFlip() ? 'editor' : 'viewer' };
            }
        } else {
            mixtape.collaborators = [ { user: users[randInt(0, users.length)]._id, permissions: 'owner'} ];
        }
    }

    for (const user of users) {
        // GENERATE FAVORITED MIXTAPES
        const favoritedCount = randInt(MIN_FAVORITED_MIXTAPES_PER_USER, MAX_FAVORITED_MIXTAPES_PER_USER); // current users favorited mixtapes
        const favoritedMixtapes = new Set();
        for (let i = 0; i < favoritedCount; i++) {
            favoritedMixtapes.add(mixtapes[randInt(0, mixtapes.length)]._id);
        }
        user.favoritedMixtapes = Array.from(favoritedMixtapes);

        // GENERATE FOLLOWED USERS
        const followedCount = randInt(MIN_FOLLOWED_USERS_PER_USER, MAX_FOLLOWED_USERS_PER_USER);
        const followedUsers = new Set();
        for (let i = 0; i < followedCount; i++) {
            let followUser = randInt(0, users.length);
            while (users[followUser]._id === user._id) {
                followUser = randInt(0, users.length);
            }
            followedUsers.add(users[followUser]._id);
        }
        user.followedUsers = Array.from(followedUsers);

        // GENERATE INBOX MESSAGES
        const inboxCount = randInt(MIN_ANONYMOUS_INBOX_MESSAGES_PER_USER, MAX_ANONYMOUS_INBOX_MESSAGES_PER_USER);
        const comments = ['Great mixtape!', 'I like your taste in music!', 'Thanks for sharing.'];
        for (let i = 0; i < inboxCount; i++) {
            inboxMessages.push({
                mixtape: mixtapes[randInt(0, mixtapes.length)]._id,
                sender: 'Anonymous',
                recipient: user._id,
                message: comments[randInt(0, comments.length)]
            });
        }
    }

    if (process.env.WRITE_JSON_TEST_FILES) {
        const exportDir = path.join(__dirname, 'generated');
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir);
        }
        fs.writeFileSync(
            path.join(exportDir, 'users.json'),
            JSON.stringify({ users }, null, '    ')
        );
        fs.writeFileSync(
            path.join(exportDir, 'mixtapes.json'),
            JSON.stringify({ mixtapes }, null, '    ')
        );
        fs.writeFileSync(
            path.join(exportDir, 'inboxMessages.json'),
            JSON.stringify({ inboxMessages }, null, '    ')
        );
    }

    return {
        users,
        mixtapes,
        inboxMessages,
    }
}

module.exports = generateTestData;
