'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const findOrCreate = require('mongoose-findorcreate')

const Tcita = new Schema({
  tcita: String,
  freq: Number,
  disabled: Boolean,
  bangu: {
    type: Schema.ObjectId,
    ref: 'language'
  },
  kampu: Boolean,
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
})
Tcita.plugin(findOrCreate)

module.exports = mongoose.model('tcita', Tcita, 'tcita')
