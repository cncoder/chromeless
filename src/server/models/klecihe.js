'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Klecihe = new Schema({
  klesi: String,
  finti: {
    type: Schema.ObjectId,
    ref: 'user'
  },
  selgerna_filotcita: {
    type: Schema.ObjectId,
    ref: 'language'
  },
  selgerna_filovelski: {
    type: Schema.ObjectId,
    ref: 'language'
  },
  detri: Date,
  frozen: Boolean,
  detri_lenudunja: Date,
  disabled: Boolean,
  historyless: Boolean,
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
  velski: String, //dog (from 17th century)
  pinka: String,
  krasi: [
    {
      finti: {
        type: Schema.ObjectId,
        ref: 'user'
      }
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
});

module.exports = mongoose.model('klecihe', Klecihe, 'klecihe');
