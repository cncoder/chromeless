'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const random = require('mongoose-simple-random')

const Sentence = new Schema({
  mupli: String,
  detri: Date,
  finti: {
    type: Schema.ObjectId,
    ref: 'user'
  },
  bangu: {
    type: Schema.ObjectId,
    ref: 'language'
  },
  pinka: String,
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
      felomupli: {
        type: Schema.ObjectId,
        ref: 'Sentence'
      },
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
Sentence.plugin(random)

module.exports = mongoose.model('sentence', Sentence, 'sentence')
