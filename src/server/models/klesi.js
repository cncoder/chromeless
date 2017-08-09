'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var Klesi = new Schema({
  klesi: String,
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
Klesi.plugin(findOrCreate);

module.exports = mongoose.model('Klesi', Klesi, 'Klesi');
