'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var Tcita = new Schema({
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
