'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const random = require('mongoose-simple-random');

const Sentence = new Schema({
  mupli: String,
  detri: Date,
  finti: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  bangu: {
    type: Schema.ObjectId,
    ref: 'Language'
  },
  pinka: String,
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
  jorne: [
    {
      finti: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      felovelski: {
        type: Schema.ObjectId,
        ref: 'Valsi'
      },
      detri: Date,
      undone: Boolean,
      undonedetri: Date,
      felomupli: {
        type: Schema.ObjectId,
        ref: 'Sentence'
      },
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
Sentence.plugin(random);

module.exports = mongoose.model('Sentence', Sentence, 'Sentence');
