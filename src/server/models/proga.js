'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const random = require('mongoose-simple-random')
const Proga = new Schema({
  uenzi: String, //id of String, same across languages
  xefanva_pinka: String, //text, comment to the string
  vefanva: {
    type: Schema.ObjectId,
    ref: 'language'
  }, //id of language of the translation
  finti: {
    type: Schema.ObjectId,
    ref: 'user'
  }, //who created translation
  stats: Number, //last 100 users using this translation in the same language
  detri: Date,
  frozen: Boolean,
  detri_lenudunja: Date,
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
  ],
  upvotes: [
    {
      finti: {
        type: Schema.ObjectId,
        ref: 'user'
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
        ref: 'user'
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
        ref: 'user'
      },
      tcita: {
        type: Schema.ObjectId,
        ref: 'tcita'
      },,
      detri: Date,
      undone: Boolean,
      undonedetri: Date
    }
  ]
})

module.exports = mongoose.model('proga', Proga, 'proga')
