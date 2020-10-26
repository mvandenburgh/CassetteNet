import { users } from '../testData/users.json';
import { mixtapes } from '../testData/mixtapes.json';
import { inboxMessages } from '../testData/inboxMessages.json';

// These functions return test data from local JSON files
// for now. In the future they should make requests to an 
// API on the backend server.

function getUser(username, password) {
    for (const user of users) {
        if (user.username === username && user.password === password) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
    }
    return null;
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
 * @param {*} _id id of the user who's inbox messages we want
 */
function getInboxMessages(_id) {
    return inboxMessages.filter(message => message.recipient === _id);
}

export {
    getUser,
    getUsername,
    getMixtape,
    getMyMixtapes,
    getInboxMessages,
};
