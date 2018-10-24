const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const COLLECTION_NAME = require('../models/COLLECTION_NAMES');
const AutoPopulate = require('mongoose-autopopulate');

const FIELDS = {
    NAMA: 'nama',
    DESKRIPSI: 'deskripsi',
    STATUS: 'status',
    OUTPUT: 'output'
};
const STATUS = {
    INACTIVE: 0,
    ACTIVE: 1,
    EXPIRED:2
};
const schema = {};
schema[FIELDS.NAMA] = {type: String, required:true};
schema[FIELDS.DESKRIPSI] = String;
schema[FIELDS.STATUS] = Number;
schema[FIELDS.OUTPUT] = {type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.OUTPUT};

const SubOutput = new mongoose.Schema(schema, { timestamps: true });
SubOutput.plugin(AutoIncrement, {inc_field: 'id'});
SubOutput.plugin(AutoPopulate);


const SubOutput = mongoose.model(COLLECTION_NAME.SUB_OUTPUT, SubOutput);
Output.FIELDS = FIELDS;
Output.STATUS = STATUS;
module.exports = SubOutput;
