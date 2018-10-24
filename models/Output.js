const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const COLLECTION_NAME = require('../models/COLLECTION_NAMES');
const AutoPopulate = require('mongoose-autopopulate');

const FIELDS = {
    NAMA: 'nama',
    DESKRIPSI: 'deskripsi',
    STATUS: 'status',
    SUB_KEGIATAN: 'SubKegiatan',
    SUB_OUTPUT: 'SubOutput'

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
schema[FIELDS.SUB_KEGIATAN] = {type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.SUB_KEGIATAN};
schema[FIELDS.SUB_OUTPUT] = [{type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.SUB_OUTPUT}];

const Output = new mongoose.Schema(schema, { timestamps: true });
Output.plugin(AutoIncrement, {inc_field: 'id'});
Output.plugin(AutoPopulate);


const Output = mongoose.model(COLLECTION_NAME.OUTPUT, Output);
Output.FIELDS = FIELDS;
Output.STATUS = STATUS;
module.exports = Output;
