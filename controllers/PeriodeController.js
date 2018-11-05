const menu = require('../constant/menu');
const Periode = require('../models/Periode');
const PaguUnit = require('../models/Pagu_unit');
const Unit = require('../models/Unit');
const PeriodeMessageService = require('../messages/PeriodeMessageService');
/**
 * GET /
 * Home page.
 */
const BASE_URL = '/periode';
const ROUTE_LIST = {
  CREATE_PERIODE: BASE_URL+'/new',
  INDEX_PERIODE: BASE_URL+'/index',
  DETAIL_PERIODE: BASE_URL+'/detail/:'+Periode.FIELDS.ID,
  DETAIL_PAGU_UNIT: BASE_URL+'/:'+Periode.FIELDS.ID+'/pagu_unit/:'+Periode.FIELDS.PAGU_UNIT
};
exports.indexPeriode= (req, res) => {
    Periode.getAllPeriodeData().then(function (allPeriode) {
        console.log(allPeriode);
        res.render('periode/index_periode', {
            title: 'Buat periode baru',
            menu : menu.index_periode,
            active: {
                index_periode: true
            },
            periode: allPeriode,
            fields: Periode.FIELDS
        });
    }, function (err) {
        console.log(err);
    });

};
exports.detailPeriode= (req, res) => {
    const err = PeriodeMessageService.validatePeriodeId(req);
    if (err){
        req.flash('errors', err);
        return res.redirect(ROUTE_LIST.INDEX_PERIODE);
    }
    Periode.findOne({[Periode.FIELDS.ID]:req.params[Periode.FIELDS.ID]}).then(function (periode) {
        res.render('periode/detail_periode', {
            title: 'Detail periode '+periode[Periode.FIELDS.NAMA],
            menu : menu.index_periode,
            active: {
                detail_periode: true
            },
            periode: periode,
            fields: Periode.FIELDS
        });
    }, function (err) {
        console.log(err);
    });

};
exports.detailPaguUnit= (req, res) => {
    PaguUnit.findOne({[PaguUnit.FIELDS.ID] : req.params[Periode.FIELDS.PAGU_UNIT]}).then(paguUnit=>{
        res.render('pagu_unit/detail', {
            title: 'Detail Pagu Unit '+paguUnit[PaguUnit.FIELDS.UNIT][Unit.FIELDS.NAMA]+' Periode '+paguUnit[PaguUnit.FIELDS.PERIODE][Periode.FIELDS.NAMA],
            menu : menu.index_periode,
            active: {
                detail_periode: true
            },
            paguUnit: paguUnit,
            fields: Periode.FIELDS
        });
    });

};
exports.getNew= (req, res) => {
    res.render('periode/new_periode', {
        title: 'Buat periode baru',
        menu : menu.periode_new,
        active: {
            periode_new: true
        },
        fields: Periode.FIELDS
    });
};
exports.postNew= (req, res) => {
    const err = PeriodeMessageService.validatePeriodeCreation(req);
    if (err){
        req.flash('errors', err);
        return res.redirect(ROUTE_LIST.CREATE_PERIODE);
    }
    const periodeObj = {
        [Periode.FIELDS.NAMA]: req.body[Periode.FIELDS.NAMA],
        [Periode.FIELDS.STATUS]: req.body[Periode.FIELDS.STATUS] == 'active'? true : false,
        [Periode.FIELDS.USER]: req.user._id,
        [Periode.FIELDS.PAGU]: req.body[Periode.FIELDS.PAGU]
    };
    Periode.createNewPeriodeWithPaguUnit(periodeObj).then(periodeWithPagu=>{
        req.flash('success', PeriodeMessageService.periodeCreationSuccess(periodeWithPagu.periode));
        return res.redirect(ROUTE_LIST.INDEX_PERIODE);
    }, err=>{
        if (err=='exist'){
            req.flash('errors', PeriodeMessageService.periodeAlreadyExist(periodeObj));
        }else {
            req.flash('errors', err)
        }
        return res.redirect(ROUTE_LIST.CREATE_PERIODE);
    });
};
exports.ROUTE_LIST = ROUTE_LIST;