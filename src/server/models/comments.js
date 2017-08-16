'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const random = require('mongoose-simple-random');
const Comment = new Schema({
  root_type: String,
  root_id: Number,
  title: String,
  text: String,
  referrer: Number,
  finti: String,
  detri: Date,
  disabled: Boolean,
  disabling: [{disabled: Boolean, zukte: String, detri: Date}],
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
      tag: String,
      detri: Date,
      undone: Boolean,
      undonedetri: Date
    }
  ]
});

module.exports = mongoose.model('Comment', Comment, 'Comment');
