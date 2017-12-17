'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Krali = new Schema({
  krali: String,//"curmi tu'a su'o pilno", "ka'e jmina su'o bangu"
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
})

module.exports = mongoose.model('krali', Krali, 'krali')
