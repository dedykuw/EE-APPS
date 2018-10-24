const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const COLLECTION_NAME = require('../models/COLLECTION_NAMES');
const AutoPopulate = require('mongoose-autopopulate');

const FIELDS = {
    NAMA: 'nama',
    DESKRIPSI: 'deskripsi',
    STATUS: 'status',
    KEGIATAN: 'Kegiatan',
    OUTPUT: 'Output'
};
const STATUS = {
    INACTIVE: 0,
    ACTIVE: 1,
    EXPIRED:2
};
const schema = {};
schema[FIELDS.NAMA] = {type:String, required: true};
schema[FIELDS.STATUS] = Number;
schema[FIELDS.DESKRIPSI] = String;
schema[FIELDS.KEGIATAN] = {type: mongoose.Schema.Types.ObjectId, ref:COLLECTION_NAME.KEGIATAN};
schema[FIELDS.OUTPUT] = [{type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.SUB_OUTPUT}];
const subKegiatanSchema = new mongoose.Schema(schema, { timestamps: true });

subKegiatanSchema.plugin(AutoIncrement, {inc_field: 'id'});
subKegiatanSchema.plugin(AutoPopulate);

const SubKegiatan = mongoose.model(COLLECTION_NAME.SUB_KEGIATAN, subKegiatanSchema);
SubKegiatan.FIELDS = FIELDS;
SubKegiatan.STATUS = STATUS;
module.exports = SubKegiatan;
