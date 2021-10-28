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
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.pwd;
    User.findOne({email: email})
    .then(user => {
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if(doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    console.log(req.session);
                    res.redirect('/');
                })
            } else {
                return res.redirect('/auth/login');
            }
        })
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
};