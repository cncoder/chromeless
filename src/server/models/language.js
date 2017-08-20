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
  disabling: [
    {
      disabled: Boolean,
      zukte: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      detri: Date
    }
  ],
  upvotes: [
    {
      finti: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      detri: Date,
      undone: Boolean,
      undonedetri: Date
    }
  ],
  downvotes: [
    {
      finti: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      detri: Date,
      undone: Boolean,
      undonedetri: Date
    }
  ],
  sumvotes: Number,
  tcita: [
    {
      finti: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      tcita: {
        type: Schema.ObjectId,
        ref: 'Tcita'
      },
      detri: Date,
      undone: Boolean,
      undonedetri: Date
    }
  ]
});
Language.plugin(findOrCreate);

module.exports = mongoose.model('Language', Language, 'Language');
