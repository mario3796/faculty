exports.getIndex = (req, res, next) => {
    res.render('index', {
        path: '/',
        title: 'Index'
    })
}