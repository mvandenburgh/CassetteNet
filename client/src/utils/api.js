import axios from 'axios';
import { users } from '../testData/users.json';
import { mixtapes } from '../testData/mixtapes.json';
import { inboxMessages } from '../testData/inboxMessages.json';

axios.defaults.withCredentials = true;


let SERVER_ROOT_URL;
try {
    SERVER_ROOT_URL = new URL(process.env.REACT_APP_SERVER_ROOT_URL);
} catch (err) {
    SERVER_ROOT_URL = new URL('http://localhost:5000/');
}


// These functions return test data from local JSON files
// for now. In the future they should make requests to an 
// API on the backend server.

/**
 * 
 * @param {*} _id id of user we want to get username of
 */
function getUsername(_id) {
    for (const user of users) {
        if (user._id === _id) {
            return user.username;
        }
    }
    return null;
}

/**
 * 
 * @param {*} id id of the user we want to get my mixtapes of
 */
async function getMyMixtapes(_id) {
    // let user;
    // for (const usr of users) {
    //     if (usr._id === _id) {
    //         user = usr;
    //         break;
    //     }
    // }
    // if (!user) return [];
    const mixtapes = await axios.get(new URL('/user/mixtapes', SERVER_ROOT_URL), { withCredentials: true });
    return mixtapes.data;

    // const userMixtapes = [];
    // for (const mixtape of mixtapes) {
    //     for (const collaborator of mixtape.collaborators) {
    //         if (collaborator.user === user._id) {
    //             userMixtapes.push(mixtape);
    //             break;
    //         }
    //     }
    // }
    // return userMixtapes;
}

/**
 * 
 * @param {*} _id mixtape _id
 */
async function getMixtape(_id) {
    const mixtape = await axios.get(new URL(`/mixtape/${_id}`, SERVER_ROOT_URL));
    return mixtape.data;
}

async function updateMixtape(mixtape) {
    await axios.put(new URL(`/mixtape/${mixtape._id}`, SERVER_ROOT_URL), { mixtape });
}

async function deleteMixtape(mixtape) {
    console.log(mixtape);
    await axios.delete(new URL(`/mixtape/${mixtape._id}`, SERVER_ROOT_URL), { mixtape });
}

async function createMixtape() {
    const mixtape = await axios.post(new URL(`/mixtape`, SERVER_ROOT_URL));
    return mixtape;
}

async function songSearch(query) {
    // const results = await axios.get(new URL('/youtube/search', SERVER_ROOT_URL), { params: { q: query }});
    const results = await axios.get('http://localhost:5000/youtube/search', { params: { q: query }});
    return results.data;
}

/**
 * 
 * @param {*} _id id of the user who's favorited mixtapes we want
 */
async function getFavoritedMixtapes(_id) {
    const favoritedMixtapes = await axios.get(new URL('/user/favoritedMixtapes', SERVER_ROOT_URL), { withCredentials: true });
    return favoritedMixtapes.data;
    // let user;
    // for (const usr of users) {
    //     if (usr._id === _id) {
    //         user = usr;
    //         break;
    //     }
    // }
    // if (!user) return [];
    
    // return user.favoritedMixtapes.map(mixtapeId => getMixtape(mixtapeId));
}

async function favoriteMixtape(mixtapeId) {
    const favoritedMixtapes = await axios.put(new URL(`/user/favoriteMixtape`, SERVER_ROOT_URL), { id: mixtapeId, withCredentials: true });
    return favoritedMixtapes.data;
}

async function unfavoriteMixtape(mixtapeId) {
    const favoritedMixtapes = await axios.put(new URL(`/user/unfavoriteMixtape`, SERVER_ROOT_URL), { id: mixtapeId, withCredentials: true });
    return favoritedMixtapes.data;
}

/**
 * 
 * @param {*} _id id of the user who's inbox messages we want
 */
function getInboxMessages(_id) {
    return inboxMessages.filter(message => message.recipient === _id);
}

async function userSignup(email, username, password) {
    try {
        await axios.post(new URL('/user/signup', SERVER_ROOT_URL), { email, username, password });
    } catch(err) { // TODO: error handling
        console.log(err);
    }
}

async function userLogin(username, password) {
    try {
        const user = await axios.post(new URL('/user/login', SERVER_ROOT_URL), { username, password });
        return user.data;
    } catch(err) {
        console.log(err);
    }
}

async function userLogout() {
    await axios.post(new URL('/user/logout', SERVER_ROOT_URL));
}

export {
    createMixtape,
    deleteMixtape,
    favoriteMixtape,
    unfavoriteMixtape,
    getUsername,
    getMixtape,
    getMyMixtapes,
    getFavoritedMixtapes,
    getInboxMessages,
    songSearch,
    updateMixtape,
    userLogin,
    userLogout,
    userSignup
};
