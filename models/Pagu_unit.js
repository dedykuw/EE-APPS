const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const COLLECTION_NAME = require('../models/COLLECTION_NAMES');
const AutoPopulate = require('mongoose-autopopulate');

const FIELDS = {
    UNIT: 'unit',
    PERIODE: 'periode',
    PAGU: 'pagu',
    STATUS:'status'
};
const STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  EXPIRED:2
};
const schema = {};
schema[FIELDS.PAGU] = Number;
schema[FIELDS.UNIT] = {type: mongoose.Schema.Types.ObjectId, ref:COLLECTION_NAME.UNIT};
schema[FIELDS.STATUS] = Number;
schema[FIELDS.PERIODE] = {type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.PERIODE};

const paguUnitSchema = new mongoose.Schema(schema, { timestamps: true });

paguUnitSchema.plugin(AutoIncrement, {inc_field: 'id'});
paguUnitSchema.plugin(AutoPopulate);




const PaguUnit = mongoose.model(COLLECTION_NAME.UNIT, paguUnitSchema);
PaguUnit.FIELDS = FIELDS;
PaguUnit.STATUS = STATUS;
module.exports = PaguUnit;
