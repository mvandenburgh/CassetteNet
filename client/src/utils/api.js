import { users } from '../testData/users.json';
import { mixtapes } from '../testData/mixtapes.json';

// These functions return test data from local JSON files
// for now. In the future they should make requests to an 
// API on the backend server.

function getUser(username, password) {
    for (const user of users) {
        console.log(user)
        if (user.username === username && user.password === password) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
    }
    return null;
}

/**
 * 
 * @param {*} id id of the user we want to get my mixtapes of
 */
function getMyMixtapes(id) {
    let user;
    for (const usr of users) {
        if (usr._id === id) {
            user = usr;
            break;
        }
    }
    if (!user) return [];
    
    const userMixtapes = [];
    for (const mixtape of mixtapes) {
        for (const collaborator of mixtape.collaborators) {
            console.log(collaborator.user, user._id)
            if (collaborator.user === user._id) {
                userMixtapes.push(mixtape);
                break;
            }
        }
    }
    return userMixtapes;
}

export {
    getUser,
    getMyMixtapes,
};
