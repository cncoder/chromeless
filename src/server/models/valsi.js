'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const valsi = new Schema({
  valsi: String,
  finti: {
    type: Schema.ObjectId,
    ref: 'user'
  },
  selgerna_filovalsi: {
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
  terbri: [
    { //smuvelcki
      //0:pre 1:x1 2:(e) 3:x2 end
      idx: Number,
      klesi: [
        {
          type: Schema.ObjectId,
          ref: 'klesi'
        }
      ], //entity / property of x1 / event / text ...
      nirna: String, //x1
      sluji: String, //" is a cat of species "
    }
  ],
  old_terbri: String, //"x1 is a cat of species x2"
  velski: String, //dog (from 17th century)
  pinka: String,
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
  krasi: [
    {
      finti: {
        type: Schema.ObjectId,
        ref: 'user'
      },
      detri: Date,
      lefinti_puhivimcu: Boolean,
      lefinti_puhivimcu_detri: Date
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
  ],
  jorne: [
    {
      finti: {
        type: Schema.ObjectId,
        ref: 'user'
      },
      felovelski: {
        type: Schema.ObjectId,
        ref: 'valsi'
      },
      detri: Date,
      undone: Boolean,
      undonedetri: Date,
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
    }
  ]
});

module.exports = mongoose.model('valsi', valsi, 'valsi');
