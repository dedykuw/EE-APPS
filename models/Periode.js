const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const COLLECTION_NAMES = require('../models/COLLECTION_NAMES');
const AutoPopulate = require('mongoose-autopopulate');
const PaguUnit = require('../models/Pagu_unit');
const Unit = require('../models/Unit');
//CLASS IDENTITTY DEFINITIONS
class PeriodeClass {
    static get FIELDS(){
        return {
            NAMA: 'nama',
            STATUS: 'status',
            USER: 'user',
            PAGU: 'PAGU',
            ID: 'periode_id',
            PAGU_UNIT:'pagu_unit',
            SEMUA_UNIT:'units'
        };
    }
    static getAllPeriodeData(){
        return new Promise(function (resolve, reject) {
            Periode.find({}).exec(function (err, periodes) {
                if (err) reject(err);
                resolve(periodes);
            });
        })
    }
    get totalPaguUnit(){
        var totalPaguUnit = this[PeriodeClass.FIELDS.PAGU_UNIT];
        var result = totalPaguUnit.reduce(function(prev, curr){
            return prev+curr.pagu;
        },0);
        return result;
    }
    get totalAvailablePagu(){
        var margin = this[PeriodeClass.FIELDS.PAGU]- this.totalPaguUnit;
        return margin;
    }
    static  async totalPaguUnit(periodeObj){
        var periode = await this.findOne(periodeObj);
        var totalPaguUnit = await periode[PeriodeClass.FIELDS.PAGU_UNIT];
        var result = totalPaguUnit.reduce(function(prev, curr){
            return prev+curr.pagu;
        },0);
        return result;
    }
    static async checkPaguThreshold(periodeObj){
        var periode = await this.findOne(periodeObj);
        var totalPaguUnit = PeriodeClass.totalPaguUnit(periodeObj);
        return totalPaguUnit < periode[PeriodeClass.FIELDS.PAGU];
    }
    static findActivePeriode(){
        var attr = {[PeriodeClass.FIELDS.STATUS]: true};
        return PeriodeClass.findOne(attr);
    }
    static deactiveAllPeriode(){
        var activePeriodeCriteria = {[PeriodeClass.FIELDS.STATUS]: true};
        var updateWith = {[PeriodeClass.FIELDS.STATUS]: false};
        return Periode.updateMany(activePeriodeCriteria, updateWith);
    }
    static activatePeriode(periodeId){
        return new Promise(function(resolve, reject){
            PeriodeClass.deactiveAllPeriode().then(function(){
                var searchCriteria = {[PeriodeClass.FIELDS.ID]: periodeId};
                var updateWith = {[PeriodeClass.FIELDS.STATUS]: true};
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
    static async checkExist(periodeObj){
        try {
            return Periode.findOne({[PeriodeClass.FIELDS.NAMA]: periodeObj[PeriodeClass.FIELDS.NAMA]});
        }catch (e) {
            console.log(e);
            throw new Error(`Unable to connect to the database.`)
        }
    }
    static async createNewPeriode(periodeObj){
        var exist = await PeriodeClass.checkExist(periodeObj);
        return new Promise(function (resolve, reject) {
            if (!exist){
                if(periodeObj[PeriodeClass.FIELDS.STATUS] ==  true){
                    PeriodeClass.deactiveAllPeriode().then(function(){
                        var newPeriode = new Periode(periodeObj);
                        newPeriode.save(function (err, periode) {
                            if (err) reject(err);
                            resolve(periode);
                        })
                    })
                }else {
                    var newPeriode = new Periode(periodeObj);
                    newPeriode.save(function (err, periode) {
                        if (err) reject(err);
                        resolve(periode);
                    })
                }
            }else {
                reject('exist');
            }
        })
    };
    static createNewPeriodeWithPaguUnit(periodeObj){
        return new Promise(function (resolve, reject) {
            PeriodeClass.createNewPeriode(periodeObj).then(function (periode) {
                Unit.find({},function (err, units) {
                    var allPaguUnits = units.map(unit=>{
                        return {
                            [PaguUnit.FIELDS.PERIODE]: periode._id,
                            [PaguUnit.FIELDS.UNIT]: unit._id,
                            [PaguUnit.FIELDS.STATUS]: PaguUnit.STATUS.ACTIVE,
                            [PaguUnit.FIELDS.PAGU]: 0
                        }
                    });
                    PaguUnit.create(allPaguUnits).then(function (allPagus) {
                        allPagus.forEach(pagu=>periode[PeriodeClass.FIELDS.PAGU_UNIT].push(pagu._id));
                        periode.save();
                        resolve({
                            periode: periode,
                            paguUnit: allPagus
                        })
                    }, function (err) {
                        reject(err);
                    })
                })
            }, function (err) {
                reject(err)
            }).catch(function (err) {
                reject(err)
            })
        })
    }
    static async countPaguUnits(periodeId){
        var periode = await Periode.findOne({[PeriodeClass.FIELDS.ID]: periodeId}).exec();
        return periode[PeriodeClass.FIELDS.PAGU_UNIT].length;
    }
}

/// SCHEMA DEFINITIONS
const schema = {
    [PeriodeClass.FIELDS.NAMA]: { type: String, unique: true },
    [PeriodeClass.FIELDS.STATUS]: Boolean,
    [PeriodeClass.FIELDS.USER]: {type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAMES.USER},
    [PeriodeClass.FIELDS.PAGU]: Number,
    [PeriodeClass.FIELDS.PAGU_UNIT]: [{type:mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAMES.PAGU_UNIT, autopopulate: true}]
};
const periodeSchema = new mongoose.Schema(schema, { timestamps: true });
periodeSchema.loadClass(PeriodeClass);
periodeSchema.plugin(AutoIncrement, {inc_field: PeriodeClass.FIELDS.ID});
periodeSchema.plugin(AutoPopulate);


const Periode = mongoose.model(COLLECTION_NAMES.PERIODE, periodeSchema, COLLECTION_NAMES.PERIODE);
Periode.FIELDS = PeriodeClass.FIELDS;
module.exports = Periode;
