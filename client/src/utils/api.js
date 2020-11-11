import axios from 'axios';
import { users } from '../testData/users.json';
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
    const mixtapes = await axios.get(new URL('/user/mixtapes', SERVER_ROOT_URL), { withCredentials: true });
    return mixtapes.data;
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

async function songSearch(api, query) {
    const results = await axios.get(new URL(`/${api}/search`, SERVER_ROOT_URL).href, { params: { q: query } });
    return results.data;
}

/**
 * 
 * @param {*} _id id of the user who's favorited mixtapes we want
 */
async function getFavoritedMixtapes(_id) {
    const favoritedMixtapes = await axios.get(new URL(`/user/${_id}/favoritedMixtapes`, SERVER_ROOT_URL), { withCredentials: true });
    return favoritedMixtapes.data;
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
        await axios.post(new URL('/auth/signup', SERVER_ROOT_URL), { email, username, password });
    } catch(err) { // TODO: error handling
        console.log(err);
    }
}

async function userLogin(username, password) {
    await axios.post(new URL('/auth/login', SERVER_ROOT_URL), { username, password });
}

async function userLogout() {
    await axios.post(new URL('/auth/logout', SERVER_ROOT_URL));
}

async function userVerifyAccount(token) {
    await axios.put(new URL('/auth/verify', SERVER_ROOT_URL), { token });
}

async function verifyUserLoggedIn() {
    const user = await axios.get(new URL('/auth/login/success', SERVER_ROOT_URL).href);
    return user.data;
}

async function requestPasswordReset(email) {
    await axios.put(new URL('/auth/resetPassword', SERVER_ROOT_URL).href, { email });
}

async function resetPassword(token, password) {
    await axios.put(new URL('/auth/resetPassword', SERVER_ROOT_URL).href, { password, token });
}

async function setUsernameOfOAuthAccount(username) {
    await axios.put(new URL('/auth/setOAuthUsername', SERVER_ROOT_URL).href, { username });
}

async function uploadFile(file, filename, endpoint) {
    const formData = new FormData();
    formData.append(filename, file);
    await axios.put(new URL(endpoint, SERVER_ROOT_URL), formData);
}

function getMixtapeCoverImageUrl(mixtapeId) {
    return new URL(`/mixtape/${mixtapeId}/coverImage`, SERVER_ROOT_URL).href;
}

function getUserProfilePictureUrl(userId) {
    return new URL(`/user/${userId}/profilePicture`, SERVER_ROOT_URL).href;
}

async function getSongDuration(api, itemId) {
    const songDuration = await axios.get(new URL(`/${api}/itemDuration`, SERVER_ROOT_URL).href, { params: { itemId } });
    return songDuration.data;
}

function getSoundCloudSongUrl(itemId) {
    return new URL(`/soundcloud/streamAudio/${itemId}`, SERVER_ROOT_URL).href;
}

async function adminFillDatabase() {
    await axios.post(new URL('/admin/populateDatabase', SERVER_ROOT_URL).href);
}

async function adminDropDatabase() {
    await axios.post(new URL('/admin/dropDatabase', SERVER_ROOT_URL).href);    
}

async function getUser(userId) {
    if (userId.charAt(0) === '#') {
        if (userId.length === 5) {
            userId = `!${userId.substring(1)}`;
        } else {
            return null;
        }
    }
    const user = await axios.get(new URL(`/user/${userId}`, SERVER_ROOT_URL).href);
    return user.data;
}

async function queryForMixtapes(query) {
    const mixtapes = await axios.get(new URL(`/mixtape/searchMixtapes`, SERVER_ROOT_URL).href, { params: query });
    return mixtapes.data;
}

// search for a user
async function userSearch(searchQuery) {
    const users = await axios.get(new URL('/user/search', SERVER_ROOT_URL).href, { params: { query: searchQuery } });
    return users.data;
}

function googleLogin() {
    window.location.href = new URL('/auth/google', SERVER_ROOT_URL).href;
}

export {
    createMixtape,
    deleteMixtape,
    favoriteMixtape,
    unfavoriteMixtape,
    getUser,
    getUsername,
    getMixtape,
    getMixtapeCoverImageUrl,
    getUserProfilePictureUrl,
    getMyMixtapes,
    getFavoritedMixtapes,
    getInboxMessages,
    queryForMixtapes,
    songSearch,
    getSongDuration,
    getSoundCloudSongUrl,
    setUsernameOfOAuthAccount,
    verifyUserLoggedIn,
    updateMixtape,
    googleLogin,
    userLogin,
    userLogout,
    userSignup,
    userVerifyAccount,
    requestPasswordReset,
    resetPassword,
    uploadFile,
    adminFillDatabase,
    adminDropDatabase,
    userSearch,
};
