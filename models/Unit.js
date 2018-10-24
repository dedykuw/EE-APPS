const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const COLLECTION_NAME = require('../models/COLLECTION_NAMES');
const AutoPopulate = require('mongoose-autopopulate');

const FIELDS = {
    NAMA: 'nama',
    ID_UNIT: 'id_unit'
};
const schema = {};
schema[FIELDS.NAMA] = { type: String, unique: true };
schema[FIELDS.ID_UNIT] = Number;

const unitSchema = new mongoose.Schema(schema, { timestamps: true });

unitSchema.plugin(AutoIncrement, {inc_field: 'id'});
unitSchema.plugin(AutoPopulate);

const Unit = mongoose.model(COLLECTION_NAME.UNIT, unitSchema);
Unit.FIELDS = FIELDS;
module.exports = Unit;
