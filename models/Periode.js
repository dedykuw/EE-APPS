const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const COLLECTION_NAMES = require('../models/COLLECTION_NAMES');
const AutoPopulate = require('mongoose-autopopulate');

//CLASS IDENTITTY DEFINITIONS
class PeriodeClass {
    static get FIELDS(){
        return {
            NAMA: 'nama',
            STATUS: 'status',
            USER: 'user',
            PAGU: 'PAGU',
            ID: 'id',
            PAGU_UNIT:'pagu_unit',
            SEMUA_UNIT:'units'
        };
    }

    static  async totalPaguUnit(periodeObj){
        var periode = await this.findOne(periodeObj);
        var totalPaguUnit = await periode[this.FIELDS.PAGU_UNIT];
        var result = totalPaguUnit.reduce(function(prev, curr){
            return prev+curr.pagu;
        },0);
        return result;
    }
    static async checkPaguThreshold(periodeObj){
        var periode = await this.findOne(periodeObj);
        var totalPaguUnit = this.totalPaguUnit(periodeObj);
        return totalPaguUnit < periode[this.FIELDS.PAGU];
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
    static deletePeriode(periodeObj){
        /// still need to confirm about the delete mechanism. ex cascading or persisting
        // or auto activate the latest one if  the active one got removed

        return new Promise(function (resolve, reject) {
            this.deleteOne(periodeObj).then(function (doc) {
                resolve(doc);
            }).catch(function (err) {
                reject(err);
            })
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
schema[PeriodeClass.FIELDS.NAMA] = { type: String, unique: true };
schema[PeriodeClass.FIELDS.STATUS] = Boolean;
schema[PeriodeClass.FIELDS.USER] = {type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAMES.USER};
schema[PeriodeClass.FIELDS.PAGU_UNIT] = [{type:mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAMES.PAGU_UNIT}];
const periodeSchema = new mongoose.Schema(schema, { timestamps: true });
periodeSchema.loadClass(PeriodeClass);
periodeSchema.plugin(AutoIncrement, {inc_field: 'id'});
periodeSchema.plugin(AutoPopulate);


const Periode = mongoose.model(COLLECTION_NAMES.PERIODE, periodeSchema, COLLECTION_NAMES.PERIODE);
Periode.FIELDS = PeriodeClass.FIELDS;
module.exports = Periode;
