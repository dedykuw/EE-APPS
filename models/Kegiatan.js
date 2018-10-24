const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const COLLECTION_NAME = require('../models/COLLECTION_NAMES');
const AutoPopulate = require('mongoose-autopopulate');

const FIELDS = {
    NAMA: 'nama',
    DESKRIPSI: 'deskripsi',
    STATUS: 'status',
    UNIT: 'unit',
    SUB_KEGIATAN: 'SubKegiatan',

};
const STATUS = {
    INACTIVE: 0,
    ACTIVE: 1,
    EXPIRED:2
};
const schema = {};
schema[FIELDS.NAMA] = {type:String, required: true};
schema[FIELDS.UNIT] = [{type: mongoose.Schema.Types.ObjectId, ref:COLLECTION_NAME.UNIT}];
schema[FIELDS.STATUS] = Number;
schema[FIELDS.DESKRIPSI] = String;
schema[FIELDS.SUB_KEGIATAN] = [{type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.SUB_KEGIATAN}];

const kegiatanSchema = new mongoose.Schema(schema, { timestamps: true });

kegiatanSchema.plugin(AutoIncrement, {inc_field: 'id'});
kegiatanSchema.plugin(AutoPopulate);

const Kegiatan = mongoose.model(COLLECTION_NAME.KEGIATAN, kegiatanSchema);
Kegiatan.FIELDS = FIELDS;
Kegiatan.STATUS = STATUS;
module.exports = Kegiatan;
