const express = require('express');
const avatars = require('avatars');
const jimp = require('jimp');
const { Types } = require('mongoose');
const { InboxMessage, ListeningRoom, Mixtape, User, UserActivity } = require('../models');
const { USER_ACTIVITIES } = require('../constants');

// how many results per page when searching
const PAGINATION_COUNT = process.env.PAGINATION_COUNT || 10;

// max number of activities to show in Recent Followed User Activity section of dashboard
const MAX_USER_ACTIVITY = process.env.MAX_USER_ACTIVITY || 10;

const router = express.Router();

router.get('/followedUserActivity', async (req, res) => {
    if (!req.user) return res.status(401).send('unauthorized');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // exclude hour/mins/seconds since we want today's activities
    const unfilteredActivities = await UserActivity.find({
        createdAt: { 
            $gte: today 
        },
        user: {
            $in: req.user.followedUsers
        },
    }).sort('-createdAt').lean(); // sort so newest activity is first element
    const activities = [];
    
    for (const activity of unfilteredActivities) {
        if (activities.length > 20) {
            break;
        }
        if (activity.action === USER_ACTIVITIES.CREATE_MIXTAPE || activity.action === USER_ACTIVITIES.FAVORITE_MIXTAPE || activity.action === USER_ACTIVITIES.COMMENT_ON_MIXTAPE) {
            const mixtape = await Mixtape.findById(activity.target);
            if (!mixtape || (!mixtape.isPublic && !mixtape.collaborators.filter(c => c.user).includes(req.user._id))) {
                if (!mixtape) {
                    UserActivity.deleteOne({ _id: activity._id });
                }
                continue;
            }
        } else if (activity.action === USER_ACTIVITIES.CREATE_LISTENING_ROOM) {  // TODO: implement listening room public/private
            const listeningRoom = await ListeningRoom.findById(activity.target);
            if (!listeningRoom) {
                UserActivity.deleteOne({ _id: activity._id });
                continue;
            } else if (!listeningRoom.isPublic && !listeningRoom.invitedUsers.includes(req.user._id)) {
                continue;
            }
        } else if (activity.action === USER_ACTIVITIES.FOLLOW_USER) {
            const followedUser = await User.findById(activity.target).lean();
            activity.action = `${activity.action} ${followedUser.username}.`
        }
        const user = await User.findById(activity.user);
        activities.push({ username: user.username, ...activity });
    }

    res.send(activities.slice(0, MAX_USER_ACTIVITY));
});

router.get('/search', async (req, res) => {
    const { query, page } = req.query;
    if (!query) return res.send([]);

    let users;
    if (query.charAt(0)=='#' && query.length === 5) {
        const newQuery = parseInt(query.substring(1), 36);
        users = await User.paginate({ uniqueId: newQuery }, { lean: true, limit: PAGINATION_COUNT, page: page ? page : 1 });
    }
    else {
        users = await User.paginate(User.searchBuilder(query), { lean: true, limit: PAGINATION_COUNT, page: page ? page : 1 });
    }
    let results = [];
    for (const user of users.docs) {
        const updatedAt = new Date(user.updatedAt);
        const createdAt = new Date(user.createdAt);
        results.push({
            _id: user._id,
            username: user.username,
            uniqueId: user.uniqueId,
            createdAt: `${createdAt.getMonth()+1}/${createdAt.getDate()}/${createdAt.getFullYear()}`,
            updatedAt: `${updatedAt.getMonth()+1}/${updatedAt.getDate()}/${updatedAt.getFullYear()}`,
            followers: user.followers,
        });
    }
    return res.send({ results, currentPage: users.page, totalPages: users.totalPages, totalResults: users.totalDocs });
});

// get a user's mixtapes
// TODO: secure/authentication
router.get('/mixtapes', async (req, res) => {
    if (!req.user) return res.status(401).send([]);
    const mixtapes = await Mixtape.find({ 'collaborators.user': Types.ObjectId(req.user.id) }).lean();
    res.send(mixtapes);
});

router.get('/followedUsers', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    const { page } = req.query;
    const requser = await User.findById(req.user._id).lean();
    const followedUsers = await User.paginate({ _id: { $in: requser.followedUsers } }, { lean: true, limit: PAGINATION_COUNT, page: page ? page : 1});
    for (const user of followedUsers.docs) {
        user.createdAt = `${user.createdAt.getMonth()+1}/${user.createdAt.getDate()}/${user.createdAt.getFullYear()}`;
        user.updatedAt = `${user.updatedAt.getMonth()+1}/${user.updatedAt.getDate()}/${user.updatedAt.getFullYear()}`;
    }
    return res.send({
        users: followedUsers.docs,
        currentPage: followedUsers.page,
        totalPages: followedUsers.totalPages,
        totalResults: followedUsers.totalDocs,
    });
});



router.get('/:id/favoritedMixtapes', async (req, res) => {
    const { favoritedMixtapes } = await User.findOne({ _id: req.params.id }).lean();
    const mixtapes = [];
    for (const mixtapeId of favoritedMixtapes) {
        const mixtape = await Mixtape.findOne({ _id: mixtapeId }).lean();

        // if the mixtape is private, only allow access if the logged in user is a collaborator.
        if (mixtape && !mixtape.isPublic) {
            if (req.user) {
                const collaborators = mixtape.collaborators.map(collaborator => collaborator.user);
                if (!collaborators.includes(req.user.id)) {
                    continue;
                }
            } else {
                continue;
            }
        }
        if (mixtape) {
            const favoriteCount = (await User.find({ favoritedMixtapes: mixtapeId }).lean()).length;
            mixtape.favorites = favoriteCount;
            mixtapes.push(mixtape);
        }
    }
    res.send(mixtapes);
});

router.put('/favoriteMixtape', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    const { id } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.favoritedMixtapes.includes(id)) {
        user.favoritedMixtapes.push(Types.ObjectId(id));
        await user.save();
    }
    await UserActivity.create({ // use await because i'm not sure if the transaction is prone to race conditions with /unfavorite mixtape
        action: USER_ACTIVITIES.FAVORITE_MIXTAPE,
        target: id,
        targetUrl: `/mixtape/${id}`,
        user: req.user._id,
    });
    const mixtape = await Mixtape.findById(id);
    mixtape.favorites = mixtape.favorites + 1;
    await mixtape.save();
    return res.send(user.favoritedMixtapes);
});

router.put('/unfavoriteMixtape', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    const { id } = req.body;
    const user = await User.findById(req.user._id);
    if (user.favoritedMixtapes.includes(id)) {
        user.favoritedMixtapes.splice(user.favoritedMixtapes.indexOf(id), 1);
        await user.save();
    }
    await UserActivity.deleteOne({
        action: USER_ACTIVITIES.FAVORITE_MIXTAPE,
        target: id,
        targetUrl: `/mixtape/${id}`,
        user: req.user._id,
    });
    const mixtape = await Mixtape.findById(id);
    mixtape.favorites = mixtape.favorites - 1;
    await mixtape.save();
    return res.send(user.favoritedMixtapes);
});

router.put('/followUser', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    const { id } = req.body;
    if (req.user.id === id) return res.status(400).send('invalid request');
    const user = await User.findById(req.user._id);
    const followedUser = await User.findById(id);
    if (followedUser && !user.followedUsers.includes(id)) {
        user.followedUsers.push(Types.ObjectId(id));
        await user.save();
        followedUser.followers = followedUser.followers + 1;
        await followedUser.save();
    }
    const followedUsersDenormalized = [];
    for (const userId of user.followedUsers) {
        const followedUser = await User.findById(userId).lean();
        const createdAt = new Date(followedUser.createdAt);
        const updatedAt = new Date(followedUser.updatedAt);
        followedUsersDenormalized.push({
            _id: userId,
            uniqueId: followedUser.uniqueId,
            username: followedUser.username,
            createdAt: `${createdAt.getMonth()+1}/${createdAt.getDate()}/${createdAt.getFullYear()}`,
            updatedAt: `${updatedAt.getMonth()+1}/${updatedAt.getDate()}/${updatedAt.getFullYear()}`,
            followers: followedUser.followers, 
        });
    }
    await UserActivity.create({
        action: USER_ACTIVITIES.FOLLOW_USER,
        target: id,
        targetUrl: `/user/${id}`,
        user: req.user._id,
    });
    return res.send(followedUsersDenormalized);
});

router.put('/unfollowUser', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    const { id } = req.body;
    const user = await User.findById(req.user._id);
    const followedUser = await User.findById(id);
    if (user.followedUsers.includes(id)) {
        user.followedUsers.splice(user.followedUsers.indexOf(id), 1);
        await user.save();
    }
    if (followedUser) {
        followedUser.followers = followedUser.followers - 1;
        await followedUser.save();
    }
    const followedUsersDenormalized = [];
    for (const userId of user.followedUsers) {
        const followedUser = await User.findById(userId).lean();
        const createdAt = new Date(followedUser.createdAt);
        const updatedAt = new Date(followedUser.updatedAt);
        followedUsersDenormalized.push({
            _id: userId,
            uniqueId: followedUser.uniqueId,
            username: followedUser.username,
            createdAt: `${createdAt.getMonth()+1}/${createdAt.getDate()}/${createdAt.getFullYear()}`,
            updatedAt: `${updatedAt.getMonth()+1}/${updatedAt.getDate()}/${updatedAt.getFullYear()}`,
            followers: followedUser.followers, 
        });
    }
    await UserActivity.deleteOne({
        action: USER_ACTIVITIES.FOLLOW_USER,
        target: id,
        targetUrl: `/user/${id}`,
        user: req.user._id,
    });
    return res.send(followedUsersDenormalized);
});

router.put('/profilePicture', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    if (!req.files || !req.files.profilePicture) return res.status(400).send(null);
    const { profilePicture } = req.files;
    await User.findByIdAndUpdate(req.user._id, { profilePicture: { data: profilePicture.data, contentType: profilePicture.mimetype } });
    res.send('success');
});

router.post('/sendMessage', async (req, res) => {
    if (!req.user) return res.status(401).send('unauthorized');
    if (!req.body.message || !req.body.recipient) return res.status(400).send();
    const { message, recipient, isAnonymous } = req.body;
    const inboxMessage = {
        message,
        recipient,
    };
    if (!isAnonymous) {
        inboxMessage.senderId = req.user._id;
        inboxMessage.senderUsername = req.user.username;
    }
    try {
        const inboxMessageDb = await InboxMessage.create(inboxMessage);
        res.send(inboxMessageDb._id);
    } catch(err) {
        res.status(500).send(err);
    }
});

router.delete('/deleteMessage/:id', async (req, res) => {
    if (!req.user) return res.status(401).send('unauthorized');
    const message = await InboxMessage.findById(req.params.id);
    if (message) {
        await message.deleteOne();
    }
    const inboxMessages = await InboxMessage.find({ recipient: req.user.id }).lean();
    res.send(inboxMessages);
})

 router.delete('/deleteUser/:id',async (req, res) => {
    if (!req.user || req.user.id !== req.params.id) return res.status(401).send('unauthorized');

    await Promise.all([
        // REMOVE MESSAGES SENT OR RECIEVED BY USER
        InboxMessage.deleteMany({ recipient: Types.ObjectId(req.user.id) }),
        InboxMessage.deleteMany({ senderId: Types.ObjectId(req.user.id) }),

        // REMOVE USER ACTIVITIES
        UserActivity.deleteMany({ user: Types.ObjectId(req.user.id)})
    ]);

   
    // DELETE USER CREATED MIXTAPES AND REMOVE THEM FROM COLLABORATOR MIXTAPES
    const promises = [];
    const collabMixtapes = await Mixtape.find({'collaborators.user': Types.ObjectId(req.user.id)});

    for (const mixtape of collabMixtapes) {
        for (const collaborator of mixtape.collaborators) {
            if (collaborator.user.equals(req.user.id)) {
                if (collaborator.permissions === 'owner') { // if the user owns this mixtape, just delete the whole thing
                    promises.push(mixtape.deleteOne());
                } else { // otherwise, just remove them from the collaborators list
                    const newCollaborators = mixtape.collaborators.filter(c => !c.user.equals(req.user.id));
                    mixtape.collaborators = newCollaborators;
                    promises.push(mixtape.save());
                }
                break;
            }
        }
    }
    await Promise.all(promises);

    //DELETE USER FROM FOLLOWED USERS
    const followedUser = await User.find({followedUsers: Types.ObjectId(req.user.id)});
    //console.log("users that follow me: " + followedUser);
    var usersArrMax= followedUser.length;
    for(var i=0;i<usersArrMax;i++){
        var numFollowed=followedUser[i].followedUsers.length;
        for(var x=0;x<numFollowed;x++){
            if(followedUser[i].followedUsers[x]==req.user.id){
                followedUser[i].followedUsers.splice(x,1);
                followedUser[i].save();
                //x--;
                //numFollowed--;
            }
        }
    }
    // await followedUser.save();
 
     //DELETE COMMENTS BY USER ON MIXTAPES
     const commentedMixtapes = await Mixtape.find({ 'comments.author.user':req.user.id});
     
     //console.log(commentedMixtapes);
     for(var i =0;i<commentedMixtapes.length;i++){
         var numComments = commentedMixtapes[i].comments.length;
         for(var x =0; x<numComments;x++){
             if(commentedMixtapes[i].comments[x].author.user==Types.ObjectId(req.user.id)){
                 console.log("good compar");
                 commentedMixtapes[i].comments.splice(x,1);
                 commentedMixtapes[i].save();
                 //x--;
                 //numComments--;
             }
         }
     }
     //DECREASE FAVORITE COUNT FOR MIXTAPES FAVORITED
    //console.log(Types.ObjectId(req.user.id));
    const user = await User.findOne({_id: req.user.id});
    console.log(user);
    const favMixtapes=user.favoritedMixtapes;
    for(var x=0;x<favMixtapes.length;x++){
        var mix = await Mixtape.findById(favMixtapes[i]);
        console.log(mix);
        mix.favorites = mix.favorites-1;
        mix.save(); 
    }
 
 
     //DECREASE FOLLOWER COUNT FOR FOLLOWED USERS
     const usersFollowed = user.followedUsers;
     for(var x=0;x<usersFollowed.length;x++){
         var users = await User.findById(usersFollowed[i]);
         users.followers = users.followers-1;
         users.save(); 
     }

    await User.findByIdAndDelete(Types.ObjectId(req.user.id));
 })

router.get('/:id/profilePicture', async (req, res) => {
    const user = await User.findById(req.params.id).select('+profilePicture').lean();
    if (user && user.profilePicture && user.profilePicture.data && user.profilePicture.contentType) {
        res.set('Content-Type', user.profilePicture.contentType);
        res.send(user.profilePicture.data.buffer);
    } else if (user) {
        const avatar = await avatars({ seed: user._id });
        const j = await new jimp({
            data: avatar.bitmap.data,
            width: avatar.bitmap.width,
            height: avatar.bitmap.height,
        });
        const pngConversion = await j.getBufferAsync(jimp.MIME_PNG);
        res.set('Content-Type', 'image/png');
        res.send(pngConversion);
    } else {
        res.status(404).send('user not found');
    }
});

// Get info about any user. Exclude sensitive fields since this is public.
router.get('/:id', async (req, res) => {
    if (req.params.id.length === 5 && req.params.id.charAt(0) === '!') { // search by uniqueId
        const user = await User.findOne({ uniqueId: parseInt(req.params.id.substring(1), 36) }).select('-email -admin -verified -token').lean();
        res.send(user);
    } else { // search by _id
        const user = await User.findById(req.params.id).select('-email -admin -verified -token').lean();
        res.send(user);
    }
});



module.exports = router;
