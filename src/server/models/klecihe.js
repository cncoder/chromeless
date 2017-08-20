'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Klecihe = new Schema({
  klesi: String,
  finti: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  selgerna_filotcita: {
    type: Schema.ObjectId,
    ref: 'Language'
  },
  selgerna_filovelski: {
    type: Schema.ObjectId,
    ref: 'Language'
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
        ref: 'User'
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
        ref: 'User'
      }
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
      },,
      detri: Date,
      undone: Boolean,
      undonedetri: Date
    }
  ]
});

module.exports = mongoose.model('Klecihe', Klecihe, 'Klecihe');
