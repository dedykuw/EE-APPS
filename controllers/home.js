/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
    if (req.user) {
        return res.redirect('/dashboard');
    }
    res.render('account/login', {layout: false});
};
