'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const random = require('mongoose-simple-random')
const Comment = new Schema({
  root_type: String,//'comment','mupli','valsi','klesi'
  root_comment: String,//id of record in a model of root_type
  title: String,
  text: String,
  referrer: Number,
  finti: {
    type: Schema.ObjectId,
    ref: 'user'
  },
  detri: Date,
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
      },
      detri: Date,
      undone: Boolean,
      undonedetri: Date
    }
  ]
})

module.exports = mongoose.model('comment', Comment, 'comment')
