const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const COLLECTION_NAME = require('../models/COLLECTION_NAMES');
const AutoPopulate = require('mongoose-autopopulate');

const FIELDS = {
    UNIT: 'unit',
    PERIODE: 'periode',
    PAGU: 'pagu',
    STATUS:'status',
    ID:'id',
};
const STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  EXPIRED:2
};
const schema = {
    [FIELDS.PAGU]: Number,
    [FIELDS.UNIT]: {type: mongoose.Schema.Types.ObjectId, ref:COLLECTION_NAME.UNIT, autopopulate: true},
    [FIELDS.STATUS]: Number,
    [FIELDS.PERIODE]: {type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.PERIODE, autopopulate: true}
};

const paguUnitSchema = new mongoose.Schema(schema, { timestamps: true });

paguUnitSchema.plugin(AutoIncrement, {inc_field: FIELDS.ID});
paguUnitSchema.plugin(AutoPopulate);
const PaguUnit = mongoose.model(COLLECTION_NAME.PAGU_UNIT, paguUnitSchema, COLLECTION_NAME.PAGU_UNIT);

PaguUnit.FIELDS = FIELDS;
PaguUnit.STATUS = STATUS;
module.exports = PaguUnit;
