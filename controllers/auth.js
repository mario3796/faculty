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
