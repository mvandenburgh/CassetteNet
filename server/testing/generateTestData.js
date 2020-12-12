const fs = require('fs');
const path = require('path');
const { Types } = require('mongoose');
const Avatar = require('avatar-builder');
const ytpl = require('ytpl');
const { Mixtape, User } = require('../models');
const Fakerator = require('fakerator');
const fakerator = new Fakerator();

const NUM_OF_USERS = 50;

const MIN_COLLABORATORS_PER_MIXTAPE = 15;
const MAX_COLLABORATORS_PER_MIXTAPE = 35;

const MIN_FAVORITED_MIXTAPES_PER_USER = 5;
const MAX_FAVORITED_MIXTAPES_PER_USER = 25;

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
    'PL4o29bINVT4EG_y-k5jGoOu3-Am8Nvi10',
    'RDCLAK5uy_kb7EBi6y3GrtJri4_ZH56Ms786DFEimbM',
    'RDCLAK5uy_kvTjAvDMJJ8r8jSBPUs1dTDbzbPZGX7AU',
    'RDCLAK5uy_koO6rQqjFTV7-jnkzAAhX5RKj-P1PdTho',
    'RDCLAK5uy_lX24L_CGP46xH6pM4FgXpX4yNr3jX9xpU',
    'RDCLAK5uy_mzsD-JGeST8vqNlEDCc-pDqcZ8EqMzF_M',
    'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI',
    'PLYJK0A6CCIPnKe0gFUPvcw0aqhq3kDfWr',
    'PLyjgHc47unfT3BIZo5uEt2a-2TWKy54sU',
    'PLDIoUOhQQPlXzhp-83rECoLaV6BwFtNC4',
    'PLK9Sc5q_4K6aNajVLKtkaAB1JGmKyccf2',
    'PLNyF4u9mdcWp9u19YczK-aaQfsfj6QRWv',
    'PLmXxqSJJq-yXrCPGIT2gn8b34JjOrl4Xf',
    'PLE6rhv8iI_vJ48CbdqZqnr-6LT4A_Lxtq',
    'PLChOO_ZAB22WuyDODJ3kjJiU0oQzWOTyb',
    'PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph',
    'PLXDm2cr3AfgWNE167nmXmeEI4fIsT2Ee_',
    'PL2gNzJCL3m_8e21QH4D-Kz5KB7iC-Dk23',
    'PLGBuKfnErZlCOm-PCTtegrZZl06l4nkS6',
    'PLPCW2TX6NoOaLdjjWs1-xcF_cIyVWU-jc',
    'PLsvoYlzBrLFAJd4hNQSHw1lYjDKeQB_iU',
    'PLcirGkCPmbmEgDAsRiu9WyOGCAVEWPwhs',
    'PL96675BDF95286773',
    'PLsvoYlzBrLFASyYSjqPvgm8QetwBPnDFJ',
    'PL0BD69368AB943C89',
    'PLmXxqSJJq-yUF3jbzjF_pa--kuBuMlyQQ',
    'PL4lEESSgxM_5O81EvKCmBIm_JT5Q7JeaI',
    'PLWOP54w8bbgM2Qlyks0Bt6GQOODjjfJY-',
    'PL6Go6XFhidED5RmiuRdks87fyOvlXqn14',
    'PL0jp-uZ7a4g9FQWW5R_u0pz4yzV4RiOXu',
    'PLrwXzbX3SWnu1H2yesZA0-28anAKGK6ZE',
    'PLR7JWZAjVdyt484P_iMNVfjWuKceX5BFp',
    'PL2D4A44B959D87893',
    'PL_34_m4eTlaMExaWbVfv24i5O5Q5ZBZXU',
    'PLGEulkBmJN_RNyZZPQlCYjiIsymKJCJWh',
    'PLC1og_v3eb4jNFEE9iuFNdLCQmYhZRNvt',
    'PLzCxunOM5WFJmDRIzZJQexQfSxphkbB9o',
    'PL2788304DC59DBEB4',
    'PL2tMgWgIvcWmvK3JqG7hiSJond0fCcXwr',
    'PLjp0AEEJ0-fGKG_3skl0e1FQlJfnx-TJz',
    'PLEPQby6_o7m1-wWJunTFbIqAGWOsGF60C',
    'PLcQm5kKfw7w57QiSmkcFLpkc5JoTgx2Cf',
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

const getSecondsFromMS = (s) => {
    const splt = s.split(':');
    if (splt.length === 3) {
        return Number(splt[0]) * 3600 + Number(splt[1]) * 60 + Number(splt[2]);
    } else if (splt.length === 2) {
        return Number(splt[0]) * 60 + Number(splt[1]);
    } else if (splt.length === 1) {
        return Number(splt[0]);
    } else {
        return 0;
    }
}

async function generateMixtapes() {
    const mixtapes = [];
    for (let i = 0; i < SAMPLE_PLAYLISTS.length; i++) {
        if (i >= SAMPLE_PLAYLISTS.length) break;
        let songs = [];
        let playlistId = SAMPLE_PLAYLISTS[i];
        try {
            const playlist = await ytpl(playlistId);
            songs = playlist.items
                    .map(entry => ({
                        name: entry.title,
                        id: entry.id,
                        coverImage: entry.bestThumbnail.url,
                        type: 'youtube',
                        playbackUrl: `https://www.youtube.com/watch?v=${entry.id}`,
                        duration: getSecondsFromMS(entry.duration),
                    })
            );
            const isPublic = true;
            const newMixtape = new Mixtape({
                name: playlist.title,
                collaborators: [],
                songs,
                isPublic,
            });
            await newMixtape.save();
            mixtapes.push(newMixtape);
        } catch (err) {
            console.log(err);
        }
    }
    return mixtapes;
}


async function generateUsers(count) {
    const users = [];
    let current_unique_id = 0;
    const emails = new Set();
    const usernames = new Set();
    for (let i = 0; i < count; i++) {
        let username = fakerator.internet.userName();
        if (usernames.has(username)) {
            username = `${username}${Date.now().toString().substring(0, 5)}`
        }
        usernames.add(username);
        const password = 'password';
        let email = fakerator.internet.email();
        if (emails.has(email)) {
            email = `${Date.now().toString().substring(0, 5)}${email}`;
        }
        emails.add(email);
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
        const u = {
            username,
            email,
            verified,
            favoritedMixtapes,
            followedUsers,
            followers: 0,
            admin,
            uniqueId: current_unique_id,
            profilePicture: {
                data: profilePictureData,
                contentType: 'image/png'
            }
        };
        const newUser = await User.register(u, password);
        users.push(newUser);
    }
    return users;
}

async function generateTestData(mixtapes, users) {
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
        await mixtape.save();
    }

    for (const user of users) {
        // GENERATE FAVORITED MIXTAPES
        const favoritedCount = randInt(MIN_FAVORITED_MIXTAPES_PER_USER, MAX_FAVORITED_MIXTAPES_PER_USER); // current users favorited mixtapes
        const favoritedMixtapes = new Set();
        for (let i = 0; i < favoritedCount; i++) {
            let mixtapeIndex = randInt(0, mixtapes.length);
            favoritedMixtapes.add(mixtapes[mixtapeIndex]._id);
            mixtapes[mixtapeIndex].favorites = mixtapes[mixtapeIndex].favorites + 1;
            await mixtapes[mixtapeIndex].save();
        }
        user.favoritedMixtapes = Array.from(favoritedMixtapes);

        // GENERATE FOLLOWED USERS
        const followedCount = randInt(Math.ceil(users.length / 4), users.length-1);
        const followedUsers = new Set();
        for (let i = 0; i < followedCount; i++) {
            let followUser = randInt(0, users.length);
            while (users[followUser]._id === user._id) {
                followUser = randInt(0, users.length);
            }
            followedUsers.add(users[followUser]._id);
            users[followUser].followers = users[followUser].followers + 1;
            await users[followUser].save();
        }
        user.followedUsers = Array.from(followedUsers);

        await user.save();

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

module.exports = { generateUsers, generateMixtapes, generateTestData };
