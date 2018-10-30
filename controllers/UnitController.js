const Unit = require('../models/Unit');
const UnitMessageService = require('../messages/UnitMessagesService');

//export static controllers to express router


const ROUTE_LIST = {
  CREATE_UNIT: '/unit/create',
  UPDATE_UNIT: '/unit/update',
  DELETE_UNIT: '/unit/delete',
  APPEND_KEGIATAN: '/unit/append_kegiatan',
  REMOVE_KEGIATAN: '/unit/remove_kegiatan',
  LIST_UNIT_PAGE: '/unit/index'
};
function createUnitPost(req, res) {
    var err = UnitMessageService.validateUnitCreation(req);
    if(err){
        req.flash('errors', err);
        return res.redirect(ROUTE_LIST.CREATE_UNIT);
    }
    var unitObj = {
        [Unit.FIELDS.NAMA]: req.body[Unit.FIELDS.NAMA],
        [Unit.FIELDS.ID_UNIT]: req.body[Unit.FIELDS.ID_UNIT]
    };
    Unit.createUnit(unitObj).then((unit)=>{
        req.flash('notify', UnitMessageService.unitCreationSuccess(unitObj));
        return res.redirect(ROUTE_LIST.LIST_UNIT_PAGE);
    }, (err)=>{
        req.flash('errors', err);
        return res.redirect(ROUTE_LIST.CREATE_UNIT);
    })
}
function createUnitGet(req, res) {
    res.render('account/signup', {
        title: 'Create Account'
    });
}
