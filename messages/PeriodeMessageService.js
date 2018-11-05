const Periode = require('../models/Periode');
class  PeriodeMessageService{
    static get Messages(){
        return {
            RECEIVE_CREATE: 'Request received ',
            NAME_REQUIRED: 'Periode harus diisi',
            ID_REQUIRED: 'Periode id tidak ditemukan',
        }
    }
    static validatePeriodeCreation(req){
        req.assert(Periode.FIELDS.NAMA, PeriodeMessageService.Messages.NAME_REQUIRED).notEmpty();
        return req.validationErrors();
    }
    static validatePeriodeId(req){
        req.assert(Periode.FIELDS.ID, PeriodeMessageService.Messages.ID_REQUIRED).notEmpty();
        return req.validationErrors();
    }
    static periodeCreationSuccess(periodeObj){
        return {
            msg: `Penambahan ${ periodeObj[Periode.FIELDS.STATUS] ? ' dan pengaktifan ':''} periode baru ${periodeObj[Periode.FIELDS.NAMA]} berhasil`
        };
    }
    static periodeAlreadyExist(periodeObj){
        return {
            msg: `Periode dengan ${periodeObj[Periode.FIELDS.NAMA]} telah ada`
        };
    }
}

module.exports =  PeriodeMessageService;