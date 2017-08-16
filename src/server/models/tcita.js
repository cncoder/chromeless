'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');
const Tcita = new Schema({
  tcita: String,
  freq: Number,
  disabled: Boolean,
  disabling: [
    {
      disabled: Boolean,
      zukte: String,
      detri: Date
    }
  ]
});
Tcita.plugin(findOrCreate);

module.exports = mongoose.model('Tcita', Tcita, 'Tcita');
