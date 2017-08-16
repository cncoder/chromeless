'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

const Language = new Schema({
  krasi_cmene: String,
  isPredicateLanguage: Boolean,
  freq: Number,
  terfanva_freq: Number,
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
  tags: [
    {
      finti: String,
      tag: String,
      detri: Date,
      undone: Boolean,
      undonedetri: Date
    }
  ]
});
Language.plugin(findOrCreate);

module.exports = mongoose.model('Language', Language, 'Language');
