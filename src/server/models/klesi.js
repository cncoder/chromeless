'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

const Klesi = new Schema({
  klesi: String,
  freq: Number,
  disabled: Boolean,
  disabling: [
    {
      disabled: Boolean,
      zukte: {
        type: Schema.ObjectId,
        ref: 'user'
      },
      detri: Date
    }
  ]
});
Klesi.plugin(findOrCreate);

module.exports = mongoose.model('klesi', Klesi, 'klesi');
