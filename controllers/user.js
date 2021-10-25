const User = require("../models/user");

exports.getIndex = (req, res, next) => {
    User.find()
    .then(users => {
        res.render('index', {
            path: '/',
            title: 'Index',
            users: users
        })
    })
    .catch(err => console.log(err));
};

exports.getDetails = (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
    .then(user => {
        res.render('user-details', {
            path: '/user-details',
            title: 'User Details',
            user: user
        });
    })
    .catch(err => console.log(err));
};

exports.getStudents = (req, res, next) => {
    User.find({user_type: 'student'})
    .then(users => {
        res.render('index', {
            path: '/students',
            title: 'Students',
            users: users
        })
    })
    .catch(err => console.log(err));
};