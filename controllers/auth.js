const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/auth/login',
        title: 'Login'
    })
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/auth/signup',
        title: 'Signup'
    })
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.pwd;
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = hashedPassword;
        user.user_type = 'admin';
        return user.save();
    })
    .then(result => {
        console.log(result);
        res.redirect('/auth/login');
    })
    .catch(err => console.log(err));
}