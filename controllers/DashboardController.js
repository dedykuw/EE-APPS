const menu = require('../constant/menu');
/**
 * GET /
 * Home page.
 */
exports.dashboard = (req, res) => {
    res.render('dashboard/index', {
        title: 'Selamat datang di dashboard RKA-KL Universitas Sriwijaya',
        menu : menu.dashboard,
        active: {
            dashboard: true
        }
    });
};
