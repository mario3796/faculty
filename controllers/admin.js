exports.getAddUser = (req, res, next) => {
    res.render('admin/edit-user', {
        path: '/admin/add-user',
        title: 'Add User'
    });
}