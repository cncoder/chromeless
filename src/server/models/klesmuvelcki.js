'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Klesmuvelcki = new Schema({
  klesi: {
    type: Schema.ObjectId,
    ref: 'Klesi'
  },
  finti: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  selgerna_filovalsi: String,
  selgerna_filovelski: String,
  detri: Date,
  frozen: Boolean,
  detri_lenudunja: Date,
  disabled: Boolean,
  historyless: Boolean,
  disabling: [
    {
      disabled: Boolean,
      zukte: String,
      detri: Date
    }
  ],
  terbri: [
    { //smuvelcki
      //0:pre 1:x1 2:(e) 3:x2 end
      idx: Number,
      klesi: [String],
      nirna: String, //entity / property of x1 / event / text ...
      sluji: String, //" is a cat of species "
    }
  ],
  old_terbri: String, //"x1 is a cat of species x2"
  velski: String, //dog (from 17th century)
  pinka: String,
  krasi: [
    {
      bangu: String
    }
  ],
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
  jorne: [
    {
      finti: String,
      felovelski: String,
      detri: Date,
      undone: Boolean,
      undonedetri: Date,
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
          tcita: String,
          detri: Date,
          undone: Boolean,
          undonedetri: Date
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Klesmuvelcki', Klesmuvelcki, 'Klesmuvelcki');
