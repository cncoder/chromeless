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
  senelci_bangu: [
    {
      id: Number,
      finti: {
        type: Schema.ObjectId,
        ref: 'language'
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
  krali: [
    {
      finti: {
        type: Schema.ObjectId,
        ref: 'user'
      },
      krali: {
        type: Schema.ObjectId,
        ref: 'Krali'
      },
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
module.exports = mongoose.model('user', userSchema, 'user');
