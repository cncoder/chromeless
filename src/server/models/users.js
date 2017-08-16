'use strict';

const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  cmene: String,
  login_type: String,
  local: {
    username: String,
    email: String,
    password: String,
    passwordLastRestored: Date
  },
  facebook: {
    id: String,
    token: String,
    displayName: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String
  },
  google: {
    id: String,
    token: String,
    displayName: String
  },
  aboutme: String,
  bangu: String,
  senelci_bangu: [
    {
      id: Number,
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
  disabled: Boolean,
  disabling: [
    {
      disabled: Boolean,
      zukte: String,
      detri: Date
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
  ],
  krali: [
    {
      finti: String,
      krali: String, //"curmi tu'a su'o pilno", "ka'e jmina su'o bangu"
      detri: Date,
      undone: Boolean,
      undonedetri: Date
    }
  ]
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// method for social authentication
userSchema.plugin(findOrCreate);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema, 'User');
