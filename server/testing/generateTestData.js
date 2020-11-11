const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Types } = require('mongoose');
const { parse, toSeconds } = require('iso8601-duration');
const Avatar = require('avatar-builder');
const { getPlaylistVideos, getVideoInfo } = require('../external_apis/youtube');

const NUM_OF_USERS = 50;

const MIN_COLLABORATORS_PER_MIXTAPE = 15;
const MAX_COLLABORATORS_PER_MIXTAPE = 35;

const MIN_FAVORITED_MIXTAPES_PER_USER = 5;
const MAX_FAVORITED_MIXTAPES_PER_USER = 25;

const MIN_FOLLOWED_USERS_PER_USER = 6;
const MAX_FOLLOWED_USERS_PER_USER = 40;

const MIN_ANONYMOUS_INBOX_MESSAGES_PER_USER = 5;
const MAX_ANONYMOUS_INBOX_MESSAGES_PER_USER = 30;

if (MAX_COLLABORATORS_PER_MIXTAPE > NUM_OF_USERS) throw new Error('Max collaborators must be less than number of existing users');


const SAMPLE_PLAYLISTS = [
    'PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG',
    'PLNSvUjadUIVCNXxRsoSXrlsJQSWLzBwYA',
    'PLQHnNscWoAtw-wxC3kQhYVHe4j7LGlNFD',
    'PLXdko0_SM_Fzb7dY9WPE53gJNVK7EGldD',
    'PLRZlMhcYkA2G3kufxNpDwFN64jmNUmjt6',
    'PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU',
    'PLZyqOyXxaVETqpHhT_c5GPmAPzhJpJ5K7',
    'PL55713C70BA91BD6E',
    'PLv4rTrzgrF2Bh0KJJiMdQ1ActBQcAPzNs',
    'PLZkYUCUfToCe8gqj3AlTZoUosT60THZpM',
    'PLZT-Z4PSNV5fUlyLXiHatp1SJJaCfF3JM',
    'PLkqz3S84Tw-SesEEVw6x9UgeROTG0dFqJ',
    'PL_34_m4eTlaPc_CPB-hrNUzBQF4bFOHWd',
    'PLu1S36l0eVs3uxzUk38MiXL9PMRhlB2-w',
    'PLEPQby6_o7m34KVQslk3BJV-nWgBhD-mk',
    'PLHB7pQtzGtiWCUCOfh1rFyRHk-EkxvZXa',
    'PL11CC59281C5FDFB3',
    'PL9d4T43DjoG00204Ib__YC0KM6M5Cow8R',
    'PLQoq3MJd_TfeD4m5buLPXA6nhXPntyJ_9',
    'PLs_BtJUr-PzQQLWIg82WdIOyYs0An9jzi',
    'PLR7sPawuzFmKc1Q0dFwbawJASpUo8Kggp',
    'PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU',
];

const AVATAR_TYPES = [
    Avatar.Image.identicon,
    Avatar.Image.square,
    Avatar.Image.triangle,
    Avatar.Image.github,
    Avatar.Image.cat,
    Avatar.Image.male8bit,
    Avatar.Image.female8bit
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
) => Types.ObjectId(s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h)));


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const randInt = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));

// returns true or false randomly
const coinFlip = () => Boolean(randInt(0,2));


async function generateMixtapes() {
    const mixtapes = [];
    for (let i = 0; i < SAMPLE_PLAYLISTS.length; i++) {
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
            const videosInfo = await getVideoInfo(songs.map(song => song.id).toString());
            videosInfo.forEach((info, i) => {
                songs[i].duration = toSeconds(parse(info.contentDetails.duration));
            });
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
        const avatar = Avatar.builder(
            Avatar.Image.margin(Avatar.Image.roundedRectMask(Avatar.Image.compose(
              Avatar.Image.randomFillStyle(),
              Avatar.Image.shadow(Avatar.Image.margin(AVATAR_TYPES[randInt(0, AVATAR_TYPES.length)](), 8),
              {blur: 5, offsetX: 2.5, offsetY: -2.5,color:'rgba(0,0,0,0.75)'})
            ), 32), 8),
        128, 128);
        const profilePictureData = await avatar.create(username);
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
            profilePicture: {
                data: profilePictureData,
                contentType: 'image/png'
            }
        });
    }
    return users;
}

async function generateTestData() {
    const mixtapes = await generateMixtapes();
    const users = await generateUsers(NUM_OF_USERS);
    const inboxMessages = []; // to be filled in later

    for (const mixtape of mixtapes) {
        // GENERATE MIXTAPE COLLABORATORS
        if (coinFlip()) {
            const collaborators = new Set();
            for (let i = 0, end = randInt(MIN_COLLABORATORS_PER_MIXTAPE, MAX_COLLABORATORS_PER_MIXTAPE); i < end; i++) {
                const randomUser = randInt(0, users.length);
                collaborators.add({ user: users[randomUser]._id, username: users[randomUser].username });
            }
            mixtape.collaborators = Array.from(collaborators);
            if (mixtape.collaborators.length === 0) {
                const randomUser = randInt(0, users.length);
                mixtape.collaborators.push({ user: users[randomUser]._id, username: users[randomUser].username });
            }
            mixtape.collaborators[0] = { user: mixtape.collaborators[0].user, username: mixtape.collaborators[0].username, permissions: 'owner' };
            for (let i = 1; i < mixtape.collaborators.length; i++) {
                mixtape.collaborators[i] = { user: mixtape.collaborators[i].user, username: mixtape.collaborators[i].username, permissions: coinFlip() ? 'editor' : 'viewer' };
            }
        } else {
            const userIndex = randInt(0, users.length);
            mixtape.collaborators = [ { user: Types.ObjectId(users[userIndex]._id), username: users[userIndex].username, permissions: 'owner'} ];
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
