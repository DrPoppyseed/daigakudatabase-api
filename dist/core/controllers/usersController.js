var User = require('../../models/user');
var UserSchoolLike = require('../../models/userSchoolLike');
exports.signUp = function (req, res, next) {
    var user = new User({
        userId: req.body.user.uid,
        email: req.body.user.email,
        emailVerified: req.body.user.emailVerified || false,
        thumbnail: req.body.user.photoUrl,
        profileStatus: {
            status: 0,
        },
        personalAppState: {
            theme: 0,
        },
    });
    return user
        .save()
        .then(function (user) {
        res.status(201).json({ message: 'New user created', userId: user.userId });
    })
        .catch(function (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
exports.signIn = function (req, res, next) {
    var user_id = req.firebaseToken.user_id;
    User.findOne({ userId: user_id })
        .then(function (user) {
        if (!user) {
            if (req.header('X-Is-Google-SignIn')) {
                // if signIn with google is true and no corresponding user is created yet,
                // create new user w/ info from decoded firebaseToken
                var user_1 = new User({
                    userId: req.firebaseToken.uid,
                    email: req.firebaseToken.email,
                    emailVerified: req.firebaseToken.email_verified,
                    thumbnail: req.firebaseToken.picture,
                    profileStates: {
                        status: 0,
                    },
                    personalAppState: {
                        theme: 0,
                    },
                });
                return user_1
                    .save()
                    .then(function (user) {
                    res.status(201).json({
                        message: 'New user created via Google auth',
                        userId: user.userId,
                    });
                })
                    .catch(function (err) {
                    if (!err.statusCode)
                        err.statusCode = 500;
                    next(err);
                });
            }
            else {
                var error = new Error('Could not find account with user ID');
                error.statusCode = 404;
                throw error;
            }
        }
        res.status(200).json({ message: 'User signed in', user: user });
    })
        .catch(function (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
exports.likeSchool = function (req, res, next) {
    var user_id = req.firebaseToken.user_id;
    if (!user_id)
        res.status(401).json({ message: 'Invalid url: userId not found' });
    console.log(user_id);
    var ipeds_unitid = req.query.ipeds_unitid;
    if (!ipeds_unitid)
        res.status(401).json({ message: 'Invalid url: ipeds_unitid not found' });
    var userSchoolLike = new UserSchoolLike({
        userId: user_id,
        ipeds_unitid: ipeds_unitid,
    });
    userSchoolLike
        .save()
        .then(function (userSchoolLike) {
        User.findOne({ userId: user_id })
            .then(function (user) {
            if (!user) {
                var error = new Error('Could not find account with user ID');
                error.statusCode = 404;
                throw error;
            }
            else {
                user.likedSchools.push(ipeds_unitid);
                user.save();
            }
        })
            .then(function () {
            res.status(201).json({
                message: 'school liked',
                ipeds_unitid: userSchoolLike.ipeds_unitid,
            });
        })
            .catch(function (err) {
            console.log(err);
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        });
    })
        .catch(function (err) {
        console.log(err);
        err.statusCode = !err.statusCode && 500;
        next(err);
    });
};
exports.unlikeSchool = function (req, res, next) {
    var user_id = req.firebaseToken.user_id;
    var ipeds_unitid = req.query.ipeds_unitid;
    console.log(ipeds_unitid);
    UserSchoolLike.deleteOne({ userId: user_id, ipeds_unitid: ipeds_unitid })
        .then(function () {
        User.findOne({ userId: user_id })
            .then(function (user) {
            if (!user) {
                var error = new Error('Could not find account with user ID');
                error.statusCode = 404;
                throw error;
            }
            else {
                user.likedSchools = user.likedSchools.filter(function (school) { return school !== ipeds_unitid; });
                user.save();
            }
        })
            .then(function () {
            res.status(204).json({ message: 'school unliked.' });
        })
            .catch(function (err) {
            console.log(err);
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        });
    })
        .catch(function (err) {
        console.log(err);
        err.statusCode = !err.statusCode && 500;
        next(err);
    });
};
