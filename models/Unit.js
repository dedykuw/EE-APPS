const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const COLLECTION_NAME = require('../models/COLLECTION_NAMES');
const AutoPopulate = require('mongoose-autopopulate');
const UnitMessageService = require('../messages/UnitMessagesService');


class UnitClass {
    static get FIELDS(){
        return {
            NAMA: 'nama',
            ID_UNIT: 'id_unit',
            KEGIATAN: 'kegiatan'
        }
    };
    static createUnit(unitObj){
        var newUnit = new this(unitObj);
        return new Promise(function (resolve, reject) {
            this.findOne(unitObj).or([
                {[this.FIELDS.NAMA]: unitObj[this.FIELDS.NAMA]},
                {[this.FIELDS.ID_UNIT]: unitObj[this.FIELDS.ID_UNIT]}
            ]).then((existingUnit)=>{
                if (existingUnit) reject(UnitMessageService.unitExistErrors(unitObj));
                return newUnit.save();
            }).then((unit)=>{
                resolve(UnitMessageService.unitCreationSuccess(unitObj));
            }).catch((err)=>{
                reject(err);
            })
        })
    }
}
const schema = {
    [UnitClass.FIELDS.NAMA]: { type: String, unique: true, required: true },
    [UnitClass.FIELDS.ID_UNIT]: Number,
    [UnitClass.FIELDS.KEGIATAN]: {type: mongoose.Schema.Types.ObjectId, ref:COLLECTION_NAME.KEGIATAN}
};
const unitSchema = new mongoose.Schema(schema, { timestamps: true });
unitSchema.loadClass(UnitClass);
unitSchema.plugin(AutoPopulate);

const Unit = mongoose.model(COLLECTION_NAME.UNIT, unitSchema, COLLECTION_NAME.UNIT);
Unit.FIELDS = UnitClass.FIELDS;
module.exports = Unit;
