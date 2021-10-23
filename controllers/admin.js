const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getAddUser = (req, res, next) => {
    User.find()
    .then(users => {
        res.render('admin/edit-user', {
            path: '/admin/add-user',
            title: 'Add User',
            editing: false,
            users: users
        });
    })
    .catch(err => console.log(err));
}

exports.postAddUser = (req, res, next) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const password = req.body.pwd;
    const userType = req.body.userType;
    const department = req.body.dept;
    
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const user = new User();
        user.name = firstName + ' ' + lastName;
        user.email = email;
        user.password = hashedPassword;
        user.user_type = userType;
        user.department = department;
        return user.save();
    })
    .then(result => {
        console.log(result);
        res.redirect('/');
    })
    .catch(err => console.log(err));
};