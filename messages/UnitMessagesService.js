const Unit = require('../models/Unit');
class  UnitMessageService{
    static get Messages(){
        return {
            NAME_REQUIRED: 'Nama harus diisi',
            ID_UNIT_REQUIRED: 'ID Unit harus diisi'
        }
    }
    static validateUnitCreation(req){
        req.assert(Unit.FIELDS.NAMA, UnitMessageService.NAME_REQUIRED);
        req.assert(Unit.FIELDS.ID_UNIT, UnitMessageService.ID_UNIT_REQUIRED);
        return req.validationErrors();
    }
    static validateUnitUpdate(req){
        return false;
    }
    static validateUnitDelete(req){
        return false;
    }
    static unitExistErrors(unitObj){
        return {
          msg: `Unit dengan unit id ${unitObj[Unit.FIELDS.ID_UNIT]} atau nama ${unitObj[Unit.FIELDS.NAMA]} telah ada`
        };
    }
    static unitCreationSuccess(unitObj){
        return {
          msg: `Unit dengan unit id ${unitObj[Unit.FIELDS.ID_UNIT]} atau nama ${unitObj[Unit.FIELDS.NAMA]} berhasil ditambahkan`
        };
    }
};

module.exports =  UnitMessageService;