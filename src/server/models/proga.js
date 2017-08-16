'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const random = require('mongoose-simple-random');
const Proga = new Schema({
  uenzi: String, //id of String, same across languages
  xefanva_pinka: String, //text, comment to the string
  vefanva: String,//id of language of the translation
  finti: String,//who created translation
  stats: Number, //last 100 users using this translation in the same language
  detri: Date,
  frozen: Boolean,
  detri_lenudunja: Date,
  disabled: Boolean,
  disabling: [{disabled: Boolean, zukte: String, detri: Date}],
  upvotes: [
    {
      finti: String,
      detri: Date,
      undone: Boolean,
      undonedetri: Date
    }
  ],
  downvotes: [
    {
      finti: String,
      detri: Date,
      undone: Boolean,
      undonedetri: Date
    }
  ],
  sumvotes: Number,
  tcita: [
    {
      finti: String,
      tcita: String,
      detri: Date,
      undone: Boolean,
      undonedetri: Date
    }
  ],
});

module.exports = mongoose.model('Proga', Proga, 'Proga');
