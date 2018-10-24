const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const COLLECTION_NAMES = require('../models/COLLECTION_NAMES');
const AutoPopulate = require('mongoose-autopopulate');

//CLASS IDENTITTY DEFINITIONS
class PeriodeClass {
    static get FIELDS(){
        return {
            NAME: 'nama',
            STATUS: 'status',
            USER: 'user',
            PAGU: 'PAGU',
            ID: 'id'
        };
    }
    static findActivePeriode(){
        var attr = {};
        attr[this.FIELDS.STATUS] = true;
        return this.findOne(attr);
    }
    static deactiveAllPeriode(){
        var activePeriodeCriteria = {};
        activePeriodeCriteria[this.FIELDS.STATUS] = true;
        var updateWith = {};
        updateWith[this.FIELDS.STATUS] = false;
        return this.updateMany(activePeriodeCriteria, updateWith);
    }
    static activatePeriode(periodeId){
        return new Promise(function(resolve, reject){
            this.deactiveAllPeriode().then(function(){
                var searchCriteria = {};
                searchCriteria[this.FIELDS.ID] = periodeId;
                var updateWith = {};
                updateWith[this.FIELDS.STATUS] = true;

                this.update(searchCriteria,updateWith)
                    .then(function (doc) {
                        resolve(doc)
                    })
                    .catch(function (err) {
                        reject(err)
                    });

            });
        })
    }
    static createNewPeriode(periodeObj){
        return new Promise(function (resolve, reject) {
            if(periodeObj[this.FIELDS.STATUS] == true){
                this.deactiveAllPeriode().then(function(){
                    var newPeriode = new this(periodeObj);
                    newPeriode.save(function (err, periode) {
                        if (err) reject(err);
                        resolve(periode);
                    })
                })
            }else {
                var newPeriode = new this(periodeObj);
                newPeriode.save(function (err, periode) {
                    if (err) reject(err);
                    resolve(periode);
                })
            }
        })
    };
}

/// SCHEMA DEFINITIONS
const schema = {};
schema[PeriodeClass.FIELDS.NAME] = { type: String, unique: true };
schema[PeriodeClass.FIELDS.STATUS] = Boolean;
schema[PeriodeClass.FIELDS.USER] = {type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAMES.USER};
const periodeSchema = new mongoose.Schema(schema, { timestamps: true });
periodeSchema.loadClass(PeriodeClass);
periodeSchema.plugin(AutoIncrement, {inc_field: 'id'});
periodeSchema.plugin(AutoPopulate);


const Periode = mongoose.model(COLLECTION_NAMES.PERIODE, periodeSchema, COLLECTION_NAMES.PERIODE);
Periode.FIELDS = PeriodeClass.FIELDS;
module.exports = Periode;
