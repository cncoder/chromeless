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
        ref: 'User'
      },
      detri: Date
    }
  ]
});
Klesi.plugin(findOrCreate);

module.exports = mongoose.model('Klesi', Klesi, 'Klesi');
