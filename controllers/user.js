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
}