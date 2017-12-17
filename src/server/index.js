'use strict'

require('css-modules-require-hook')({
    generateScopedName: '[name]__[local]___[hash:base64:5]',
})

require("babel-register")
const app = require('./app')
