const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const COLLECTION_NAME = require('../models/COLLECTION_NAMES');
const AutoPopulate = require('mongoose-autopopulate');


class KegiatanClass {
    static get FIELDS(){
        return {
            NAMA: 'nama',
            DESKRIPSI: 'deskripsi',
            STATUS: 'status',
            UNIT: 'unit',
            SUB_KEGIATAN: 'SubKegiatan',

        }
    }
    static get STATUS(){
        return {
            INACTIVE: 0,
            ACTIVE: 1,
            EXPIRED:2
        }
    }
}
const schema = {};
schema[KegiatanClass.FIELDS.NAMA] = {type:String, required: true};
schema[KegiatanClass.FIELDS.UNIT] = [{type: mongoose.Schema.Types.ObjectId, ref:COLLECTION_NAME.UNIT}];
schema[KegiatanClass.FIELDS.STATUS] = Number;
schema[KegiatanClass.FIELDS.DESKRIPSI] = String;
schema[KegiatanClass.FIELDS.SUB_KEGIATAN] = [{type: mongoose.Schema.Types.ObjectId, ref: COLLECTION_NAME.SUB_KEGIATAN}];

const kegiatanSchema = new mongoose.Schema(schema, { timestamps: true });
kegiatanSchema.loadClass(KegiatanClass);
kegiatanSchema.plugin(AutoIncrement, {inc_field: 'id'});
kegiatanSchema.plugin(AutoPopulate);

const Kegiatan = mongoose.model(COLLECTION_NAME.KEGIATAN, kegiatanSchema, COLLECTION_NAME.KEGIATAN);
Kegiatan.FIELDS = KegiatanClass.FIELDS;
Kegiatan.STATUS = KegiatanClass.STATUS;
module.exports = Kegiatan;
