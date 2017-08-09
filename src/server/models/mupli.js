'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var random = require('mongoose-simple-random');

var Sentence = new Schema({
  mupli: String,
  detri: Date,
  finti: String,
  bangu: Number,
  pinka: String,
  disabled: Boolean,
  historyless: Boolean,
  disabling: [{disabled: Boolean, zukte: String, detri: Date}],
  jorne: [
    {
      finti: String,
      felovelski: String,
      detri: Date,
      undone: Boolean,
      undonedetri: Date,
      felomupli: Number,
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
      ]
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
  ]
});
Sentence.plugin(random);

module.exports = mongoose.model('Sentence', Sentence, 'Sentence');
