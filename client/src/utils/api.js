import axios from 'axios';
import { users } from '../testData/users.json';
import { inboxMessages } from '../testData/inboxMessages.json';


let SERVER_ROOT_URL;
try {
    SERVER_ROOT_URL = new URL(process.env.REACT_APP_SERVER_ROOT_URL).href;
} catch (err) {
    SERVER_ROOT_URL = new URL('http://localhost:3000/').href;
}

let CLIENT_ROOT_URL;
try {
    CLIENT_ROOT_URL = new URL(process.env.REACT_APP_CLIENT_ROOT_URL).href;
} catch (err) {
    CLIENT_ROOT_URL = new URL('http://localhost:3000/').href;
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
    const mixtapes = await axios.get(new URL('/api/user/mixtapes', SERVER_ROOT_URL).href, { withCredentials: true });
    return mixtapes.data;
}

/**
 * 
 * @param {*} _id mixtape _id
 */
async function getMixtape(_id) {
    try {
        const mixtape = await axios.get(new URL(`/api/mixtape/${_id}`, SERVER_ROOT_URL).href);
        return mixtape.data;
    } catch (err) {
        return null;
    }
}

async function updateMixtape(mixtape) {
    await axios.put(new URL(`/api/mixtape/${mixtape._id}`, SERVER_ROOT_URL).href, { mixtape });
}

async function updateMyMixtapes(mixtapes) {
    await axios.put(new URL(`/api/mymixtapes`, SERVER_ROOT_URL).href, { mixtapes });
}

async function deleteMixtape(mixtape) {
    console.log(mixtape);
    await axios.delete(new URL(`/api/mixtape/${mixtape._id}`, SERVER_ROOT_URL).href, { mixtape });
}

async function createMixtape(mixtape) {
    const newMixtape = await axios.post(new URL(`/api/mixtape`, SERVER_ROOT_URL).href, { mixtape });
    return newMixtape;
}

async function forkMixtape(mixtape) {
    const newMixtape = await axios.post(new URL(`/api/mixtape/${mixtape._id}/fork`, SERVER_ROOT_URL).href, { mixtape });
    //console.log(mixtape);
    //console.log(user);
    /*const forkedMixtape = Object.assign({}, mixtape);
    forkedMixtape.collaborators.push(
        {
            permissions: "editor",
            user: user._id,
            username: user.username
        }
    );
    //console.log(forkedMixtape);
    const newMixtape = await axios.post(new URL(`/api/mixtape`, SERVER_ROOT_URL), { forkedMixtape }); */
    return newMixtape;
}


async function songSearch(api, query, page) {
    const results = await axios.get(new URL(`/api/${api}/search`, SERVER_ROOT_URL).href, { params: { q: query, page } });
    return results.data;
}

/**
 * 
 * @param {*} _id id of the user who's favorited mixtapes we want
 */
async function getFavoritedMixtapes(_id) {
    const favoritedMixtapes = await axios.get(new URL(`/api/user/${_id}/favoritedMixtapes`, SERVER_ROOT_URL).href, { withCredentials: true });
    return favoritedMixtapes.data;
}

async function favoriteMixtape(mixtapeId) {
    const favoritedMixtapes = await axios.put(new URL(`/api/user/favoriteMixtape`, SERVER_ROOT_URL).href, { id: mixtapeId, withCredentials: true });
    return favoritedMixtapes.data;
}

async function unfavoriteMixtape(mixtapeId) {
    const favoritedMixtapes = await axios.put(new URL(`/api/user/unfavoriteMixtape`, SERVER_ROOT_URL).href, { id: mixtapeId, withCredentials: true });
    return favoritedMixtapes.data;
}

async function followUser(userId) {
    const followedUsers = await axios.put(new URL(`/api/user/followUser`, SERVER_ROOT_URL).href, { id: userId, withCredentials: true });
    return followedUsers.data;
}

async function unfollowUser(userId) {
    const followedUsers = await axios.put(new URL(`/api/user/unfollowUser`, SERVER_ROOT_URL).href, { id: userId, withCredentials: true });
    return followedUsers.data;
}

async function getFollowedUsers(page){
    const users = await axios.get(new URL(`/api/user/getFollowedUsers`, SERVER_ROOT_URL).href, { params: { page }, withCredentials: true });
    return users.data;
}

async function userSignup(email, username, password) {
    await axios.post(new URL('/api/auth/signup', SERVER_ROOT_URL).href, { email, username, password });
}

async function userLogin(email, password) {
    await axios.post(new URL('/api/auth/login', SERVER_ROOT_URL).href, { email, password });
}

async function userLogout() {
    await axios.post(new URL('/api/auth/logout', SERVER_ROOT_URL).href);
}

async function userVerifyAccount(token) {
    await axios.put(new URL('/api/auth/verify', SERVER_ROOT_URL).href, { token });
}

async function verifyUserLoggedIn() {
    const user = await axios.get(new URL('/api/auth/login/success', SERVER_ROOT_URL).href);
    return user.data;
}

async function requestPasswordReset(email) {
    await axios.put(new URL('/api/auth/resetPassword', SERVER_ROOT_URL).href, { email });
}

// reset password by email
async function resetPassword(token, password) {
    await axios.put(new URL('/api/auth/resetPassword', SERVER_ROOT_URL).href, { password, token });
}

// change password through account settings
async function changePassword(currentPassword, newPassword) {
    await axios.put(new URL('/api/auth/changePassword', SERVER_ROOT_URL).href, { currentPassword, newPassword });
}

async function setUsernameOfOAuthAccount(username) {
    await axios.put(new URL('/api/auth/setOAuthUsername', SERVER_ROOT_URL).href, { username });
}

async function uploadFile(file, filename, endpoint) {
    const formData = new FormData();
    formData.append(filename, file);
    await axios.put(new URL(endpoint, SERVER_ROOT_URL), formData);
}

function getMixtapeCoverImageUrl(mixtapeId) {
    return new URL(`/api/mixtape/${mixtapeId}/coverImage`, SERVER_ROOT_URL).href;
}

function getUserProfilePictureUrl(userId) {
    return new URL(`/api/user/${userId}/profilePicture`, SERVER_ROOT_URL).href;
}

async function getSongDuration(api, itemId) {
    const songDuration = await axios.get(new URL(`/api/${api}/itemDuration`, SERVER_ROOT_URL).href, { params: { itemId } });
    return songDuration.data;
}

async function adminFillDatabase(numOfUsers) {
    await axios.post(new URL('/api/admin/populateDatabase', SERVER_ROOT_URL).href, { userCount: numOfUsers });
}

async function adminDropDatabase() {
    await axios.post(new URL('/api/admin/dropDatabase', SERVER_ROOT_URL).href);    
}
async function getAdmins(){
    const users = await axios.get(new URL('/api/admin/getAdmins',SERVER_ROOT_URL), { withCredentials: true });
    return users.data;
}


async function deleteAdmin(userId) {
    const users = await axios.put(new URL('/api/admin/deleteAdmin', SERVER_ROOT_URL), { userId });
    return users.data;
}

async function addAdmin(userId) {
    const users = await axios.put(new URL('/api/admin/addAdmin', SERVER_ROOT_URL), { userId });
    return users.data;
}

async function getUser(userId) {
    if (userId.charAt(0) === '#') {
        if (userId.length === 5) {
            userId = `!${userId.substring(1)}`;
        } else {
            return null;
        }
    }
    const user = await axios.get(new URL(`/api/user/${userId}`, SERVER_ROOT_URL).href);
    return user.data;
}

async function getCreatedMixtapes(userId) {
    const mixtapes = await axios.get(new URL(`/api/mixtape/createdMixtapes`, SERVER_ROOT_URL).href, { params: { userId } });
    return mixtapes.data;
}

// search for a user
async function userSearch(searchQuery, page) {
    const users = await axios.get(new URL('/api/user/search', SERVER_ROOT_URL).href, { params: { query: searchQuery, page } });
    return users.data;
}

async function mixtapeSearch(searchQuery, page) {
    const mixtapes = await axios.get(new URL('/api/mixtape/search', SERVER_ROOT_URL).href, { params: { query: searchQuery, page } });
    return mixtapes.data;
}

function oauthLogin(provider) {
    window.location.href = new URL(`/api/auth/${provider}`, SERVER_ROOT_URL).href;
}

function getMixtapeUrl(mixtapeId) {
    return new URL(`/mixtape/${mixtapeId}`, CLIENT_ROOT_URL).href;
}

async function createListeningRoom(mixtapeId, isPublic, invitedUsers) {
    const listeningRoomId = await axios.post(new URL('/api/listeningroom', SERVER_ROOT_URL).href, { mixtapeId, isPublic });
    if (invitedUsers) {
        for (const user of invitedUsers) {
            sendListeningRoomInvitation(user._id, listeningRoomId.data, mixtapeId);
        }
    }
    return listeningRoomId.data;
}

async function getListeningRoom(listeningRoomId) {
    const listeningRoom = await axios.get(new URL(`/api/listeningroom/${listeningRoomId}`, SERVER_ROOT_URL).href);
    return listeningRoom.data;
}

async function sendAnonymousMessage(recipient, message) {
    await axios.post(new URL('/api/user/sendMessage', SERVER_ROOT_URL).href, { recipient, message, isAnonymous: true });
}

async function sendMixtapeMessage(recipient, message) {
    await axios.post(new URL('/api/user/sendMessage', SERVER_ROOT_URL).href, { recipient, message, isAnonymous: false });
}

async function deleteInboxMessage(messageId) {
    const messages = await axios.delete(new URL(`/api/user/deleteMessage/${messageId}`, SERVER_ROOT_URL).href);
    return messages.data;
}

async function getInboxMessages() {
    const messages = await axios.get(new URL('/api/user/inboxMessages', SERVER_ROOT_URL).href);
    return messages.data;
}

async function sendDM(recipient, message) {
    await axios.post(new URL('/api/user/sendMessage', SERVER_ROOT_URL).href, { recipient, message, isAnonymous: false });
}

async function sendListeningRoomInvitation(recipient, listeningRoomId, mixtapeId) {
    await axios.put(new URL(`/api/listeningRoom/${listeningRoomId}/inviteUser`, SERVER_ROOT_URL).href, { user: recipient });
    const message = `You have been invited to a listening room. <form action="/listeningRoom/${listeningRoomId}"><input type="submit" value="Join Listening Room" /></form>`;
    await axios.post(new URL('/api/user/sendMessage', SERVER_ROOT_URL).href, { recipient, message, mixtapeId, isAnonymous: false });
}

async function getRandomMixtapes(count, type) {
    const mixtapes = await axios.get(new URL('/api/mixtape/random', SERVER_ROOT_URL).href, { params: { count, type } });
    return mixtapes.data;
}

async function getPopularMixtapes(count) {
    const mixtapes = await axios.get(new URL('/api/mixtape/popular', SERVER_ROOT_URL).href, { params: { count } });
    return mixtapes.data;
}

async function getFollowedUsersActivity() {
    const activities = await axios.get(new URL('/api/user/followedUserActivity', SERVER_ROOT_URL).href);
    return activities.data;
}

async function getSongTempo(listeningRoomId, songIndex) {
    const analysis = await axios.get(new URL(`/api/listeningroom/${listeningRoomId}/audioAnalysis/${songIndex}`, SERVER_ROOT_URL).href);
    return analysis.data;
}

async function commentOnMixtape(mixtapeId, comment) {
    const comments = await axios.post(new URL(`/api/mixtape/${mixtapeId}/comment`, SERVER_ROOT_URL).href, { comment });
    return comments.data;
}

async function getGameScores(listeningRoomId, gameType) {
    const scores = await axios.get(new URL(`/api/listeningroom/${listeningRoomId}/${gameType}/scores`, SERVER_ROOT_URL).href);
    return scores.data;
}

async function resetGameScores(listeningRoomId, gameType) {
    await axios.delete(new URL(`/api/listeningroom/${listeningRoomId}/${gameType}/scores`, SERVER_ROOT_URL).href);
}

async function getExternalPlaylist(source, link) {
    const playlists = await axios.get(new URL(`/api/${source}/playlist`, SERVER_ROOT_URL).href, { params: { link } });
    return playlists.data;
}

export {
    createMixtape,
    deleteMixtape,
    favoriteMixtape,
    unfavoriteMixtape,
    getUser,
    getUsername,
    followUser,
    unfollowUser,
    getFollowedUsers,
    getMixtape,
    getMixtapeUrl,
    getMixtapeCoverImageUrl,
    getUserProfilePictureUrl,
    getMyMixtapes,
    getFavoritedMixtapes,
    getInboxMessages,
    getCreatedMixtapes,
    songSearch,
    getSongDuration,
    setUsernameOfOAuthAccount,
    verifyUserLoggedIn,
    updateMixtape,
    updateMyMixtapes,
    oauthLogin,
    userLogin,
    userLogout,
    userSignup,
    userVerifyAccount,
    requestPasswordReset,
    resetPassword,
    changePassword,
    uploadFile,
    adminFillDatabase,
    adminDropDatabase,
    userSearch,
    mixtapeSearch,
    getAdmins,
    deleteAdmin,
    addAdmin,
    createListeningRoom,
    getListeningRoom,
    sendListeningRoomInvitation,
    forkMixtape,
    sendAnonymousMessage,
    sendMixtapeMessage,
    deleteInboxMessage,
    getRandomMixtapes,
    getPopularMixtapes,
    getFollowedUsersActivity,
    getSongTempo,
    commentOnMixtape,
    sendDM,
    getGameScores,
    resetGameScores,
    getExternalPlaylist,
    SERVER_ROOT_URL,
};
