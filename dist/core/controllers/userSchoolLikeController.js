var UserSchoolLike = require('../../models/userSchoolLike');
var User = require('../../models/user');
exports.getUserLikes = function (req, res, next) {
    var userId = req.body.userId;
    console.log(req.body);
    UserSchoolLike.find({ user_id: userId })
        .then(function (response) {
        var schoolIds = response.map(function (el) { return el.school_opeid6; });
        res
            .status(200)
            .json({ message: 'liked schools fetched.', schoolIds: schoolIds });
    })
        .catch(function (err) {
        console.log(err);
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    });
};
