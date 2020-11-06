import axios from 'axios';
import { users } from '../testData/users.json';
import { mixtapes } from '../testData/mixtapes.json';
import { inboxMessages } from '../testData/inboxMessages.json';


let SERVER_ROOT_URL;
try {
    SERVER_ROOT_URL = new URL(process.env.REACT_APP_SERVER_ROOT_URL);
} catch (err) {
    SERVER_ROOT_URL = new URL('http://localhost:5000/');
}


// These functions return test data from local JSON files
// for now. In the future they should make requests to an 
// API on the backend server.

async function getUser(username, password) {
    try {
        return await axios.post(new URL('/user/login', SERVER_ROOT_URL), { username, password });
    } catch(err) {
        console.log(err);
    }
}

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
function getMyMixtapes(_id) {
    let user;
    for (const usr of users) {
        if (usr._id === _id) {
            user = usr;
            break;
        }
    }
    if (!user) return [];
    
    const userMixtapes = [];
    for (const mixtape of mixtapes) {
        for (const collaborator of mixtape.collaborators) {
            if (collaborator.user === user._id) {
                userMixtapes.push(mixtape);
                break;
            }
        }
    }
    return userMixtapes;
}

/**
 * 
 * @param {*} _id mixtape _id
 */
function getMixtape(_id) {
    for (const mixtape of mixtapes) {
        if (mixtape._id === _id) {
            return mixtape;
        }
    }
    return null;
}

/**
 * 
 * @param {*} _id id of the user who's favorited mixtapes we want
 */
function getFavoritedMixtapes(_id) {
    let user;
    for (const usr of users) {
        if (usr._id === _id) {
            user = usr;
            break;
        }
    }
    if (!user) return [];
    
    return user.favoritedMixtapes.map(mixtapeId => getMixtape(mixtapeId));
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

export {
    getUser,
    getUsername,
    getMixtape,
    getMyMixtapes,
    getFavoritedMixtapes,
    getInboxMessages,
    userSignup
};
