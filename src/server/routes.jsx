import React from 'react'
import {renderToString} from 'react-dom/server'
import {match, RouterContext} from 'react-router'
import reactRoutes from '../client/app/routes.jsx'
const path_ = require('path')
import {path} from 'ramda'
const Lojban = require('lojban')
const Comment = require('./models/comment')
const Valsi = require('./models/valsi')
const Klesi = require('./models/klesi')
const Tcita = require('./models/tcita')
const Mupli = require('./models/mupli')
const Language = require('./models/language')
const User = require('./models/user')
import {latexParser} from "latex-parser"
import mongoose from 'mongoose'

const p = (a) => console.log(JSON.stringify(a, null, 2))

const thetwo = [
  {
    _id: "bangu",
    gentufa: true,
    freq: "freq"
  }, {
    _id: "terfanva",
    gentufa: false,
    freq: "terfanva_freq"
  }
]

const FlushPasswordInJson = (i) => {
  return {_id: i.finti._id, cmene: i.finti.cmene}
}

function FlushPassword(i) {
  i.finti = FlushPasswordInJson(i)
  if (path([
    'krasi', 'finti'
  ], i))
    i.krasi.finti = i.krasi.finti.map(FlushPasswordInJson)
  if (path([
    'tcita', 'finti'
  ], i))
    i.tcita.finti = i.tcita.finti.map(FlushPasswordInJson)
  if (path([
    'jorne', 'tcita', 'finti'
  ], i))
    i.jorne.tcita.finti = i.jorne.tcita.finti.map(FlushPasswordInJson)
  return i
}

function GetOptimizedTerbri(arrterbri) {
  let terbri = []
  for (let i in arrterbri) {
    const o = arrterbri[i]
    const parsed = latexParser.parse(o.sluji || '')
    //{"status":false,"index":{"offset":9,"line":1,"column":10},"expected":["'$'","'%'","'\\'","'\\begin'","'^'","'_'","'{'","text character"]}
    if (!parsed.status) {
      return {err: "bad TeX", parsed: parsed}
    }
    if (o.idx === 0) {
      terbri.push({
        idx: parseInt(o.idx),
        sluji: o.sluji
      })
    } else if (o.klesi && (o.klesi.length > 0)) {
      terbri.push({
        idx: parseInt(o.idx),
        klesi: o.klesi,
        nirna: o.nirna,
        sluji: o.sluji
      })
    }
  }
  return terbri
}
const routes = (app, passport) => {
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next()
    const output = {
      err: 'user is not authenticated'
    }
    res.status(401).send(output)
  }
  /*
   *
   *
   *
   * API routes
   *
   *
   */

  app.route('/api/finti').post(isLoggedIn, (req, res)=> {
    const forced = req.body.forcedoverwrite == 'true' || false
    // 0. simply bad request
    if (!path([
      'body', 'valsi'
    ], req) || !path([
      'body', 'terbri'
    ], req) || !path([
      'body', 'bangu'
    ], req)) {
      return res.status(400).send({err: 'invalid body in post, did you include a valsi, language and terbri?'})
    }
    // 1. check latex, prepare for 4.
    const terbri = GetOptimizedTerbri(JSON.parse(req.body.terbri))
    if (terbri.err)
      return res.send(terbri)

      // 2. check cmaxes, check language=>promise
    const langpromises = Promise.all(thetwo.map(kk => Language.findOne({
      '_id': req.body[kk._id]
    }).exec())).then((items) => {
      let sum = []
      for (let i in items) {
        const item = items[i]
        if (!item) {
          return {item: null, err: `parameter ${thetwo[i]._id} not found`}
        }
        let candidate = {
          item: item,
          info: 'ok'
        }
        if (thetwo[i].gentufa && item.krasi_cmene === 'lojban.') {
          const tcini = Lojban["romoi_lahi_cmaxes"](req.body["valsi"])["tcini"]
          if (tcini === 'fliba') {
            candidate = {
              item: item,
              err: 'not a lojban text'
            }
          }
        }
        candidate.type = 'lang'
        sum.push(candidate)
      }
      return sum
    })
    // 3. promise.all check all klesi. if no klesi return error
    const flatklesi = terbri.map(o => o.klesi).reduce((sum, value)=> {
      return sum.concat(value)
    }, []).filter(Boolean)
    const klesipromises = Promise.all(flatklesi.map(g => Klesi.findOne({klesi: g}).exec())).then((items)=> {
      if (!items)
        return {item: null, err: 'no klesi'}
      let sum = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        let candidate = {
          item: {
            klesi: flatklesi[i]
          },
          kunti: true
        }
        if (item) {
          candidate = {
            item: item,
            info: 'ok'
          }
        }
        candidate.type = 'klesi'
        sum.push(candidate)
      }
      return sum
    })
    //same word from the user already in the db
    const xahopromises = Valsi.find({valsi: req.body["valsi"], finti: req.user._id}).exec().then((items)=> {
      if (!items)
        return null
      let sum = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        let candidate = {
          item: {
            valsi: req.body["valsi"],
            id: item._id,
            finti: item.finti,
            selgerna_filovalsi: item.selgerna_filovalsi
          },
          type: "xahovalsi"
        }
        sum.push(candidate)
      }
      return sum
    })
    // -2-3- resolve promises
    Promise.all([langpromises, klesipromises, xahopromises]).then((items)=> {
      items = items.reduce((sum, value)=> {
        return sum.concat(value)
      }, [])
      let prs = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const promisified_item = new Promise((resolve, reject) => {
          resolve(item)
        })
        if (item.err)
          return Promise.all([promisified_item])
        prs.push(promisified_item)
      }
      return Promise.all(prs)
    }).then((items)=> {
      //todo: !items case
      if (items[0] && items[0].err) {
        const promisified_err_item = new Promise((resolve, reject) => {
          resolve(items[0])
        })
        return Promise.all([promisified_err_item])
      }
      //ok, seems like no errors. now check for kunti
      if (!forced) {
        const kunti_items = items.filter(i => i.kunti)
        if (kunti_items.length > 0) {
          const promisified_kunti = new Promise((resolve, reject) => {
            resolve({
              kunti: true,
              klemei: kunti_items.map(i => i.item.klesi)
            })
          })
          return Promise.all([promisified_kunti])
        }
        //now check if this word from the same user is already in the db.
        const xaho_items = items.filter(i => i["type"] === 'xahovalsi')
        if (xaho_items.length > 0) {
          const promisified_xaho = new Promise((resolve, reject) => {
            resolve({xaho: true, vlamei: xaho_items})
          })
          return Promise.all([promisified_xaho])
        }
      }
      //SAVE OR UPDATE
      let prs = []
      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        let candidate
        if (item.err) {
          item.err = 'not a correct lang or klesi'
          candidate = new Promise((resolve, reject) => {
            resolve(item)
          })
        } else {
          if (item.kunti && item.type === 'klesi' && item.item.klesi) {
            //now update
            const klesi = new Klesi({freq: 1, klesi: item.item.klesi})
            candidate = new Promise((resolve, reject) => {
              klesi.save((err, it, numberAffected) => {
                if (err) {
                  item.err = err.toString()
                } else {
                  item.saved = true
                  item.item = it
                  item.numberAffected = numberAffected
                }
                resolve(item)
              })
            })
          } else if (item.type === 'klesi' && item.item.klesi) {
            //not kunti so update freqs
            candidate = new Promise((resolve, reject) => {
              Klesi.findOneAndUpdate({
                _id: item.item._id
              }, {
                $set: {
                  freq: parseInt(item.item.freq) + 1
                }
              }, {
                new: true
              }, (err, doc)=> {
                if (err) {
                  item.err = err.toString()
                } else {
                  item.updated = true
                }
                resolve(item)
              })
            })
          } else if (item.type === 'lang') {
            candidate = new Promise((resolve, reject) => {
              Language.findOneAndUpdate({
                _id: item.item._id
              }, {
                $set: {
                  freq: parseInt(item.item.freq) + 1
                }
              }, {
                new: true
              }, (err, doc)=> {
                if (err) {
                  item.err = err.toString()
                } else {
                  item.updated = true
                }
                resolve(item)
              })
            })
          } else {
            item.err = 'not a correct lang or klesi'
            candidate = new Promise((resolve, reject) => {
              resolve(item)
            })
          }
        }
        items[i] = item
        prs.push(candidate)
      }
      //save tcita
      JSON.parse(req.body.tcita).map(o => {
        const tcita = o.tcita
        const candidate = new Promise((resolve, reject) => {
          Tcita.findOne({tcita}).lean().exec().then((item) => {
            if (!item)
              item = {}
            const freq = (!item || !item.freq)
              ? 1
              : parseInt(item.freq + 1)
            const new_tcita = new Tcita({freq: freq, tcita, type: 'tcita'})
            new_tcita.save((err, it, numberAffected) => {
              if (err) {
                item.err = err.toString()
              } else {
                item.saved = true
                item.saver = it
                item.numberAffected = numberAffected
              }
              resolve(item)
            })
          }, (err) => {
            resolve({type: 'tcita', tcita: o.tcita, err: err.toString()})
          })
        })
        prs.push(candidate)
      })
      return Promise.all(prs)
    }).then((items)=> {
      let prs = items.map(item => new Promise((resolve, reject) => {
        resolve(item)
      }));
      //save smuvelcki
      const newDef = new Valsi()
      newDef.valsi = req.body.valsi
      newDef.selgerna_filovalsi = req.body.bangu["value"]

      const klesi_id_map = {}
      items.map(o => {
        if (o.type === 'klesi') {
          const k = {}
          klesi_id_map[o.item.klesi] = o.item._id
        }
      })
      newDef.terbri = terbri.map(o => {
        if (o.klesi) {
          o.klesi = o.klesi.map(i => klesi_id_map[i])
        }
        return o
      })

      newDef.finti = req.user._id
      newDef.tcita = JSON.parse(req.body.tcita) || []
      newDef.tcita = newDef.tcita.map(i => {
        return {"finti": newDef.finti, "tcita": i.tcita}
      })

      const valsipromise = new Promise((resolve, reject) => {
        newDef.save((err, it, numberAffected) => {
          const valsi = {
            type: 'valsi',
            item: newDef
          }
          if (err) {
            valsi.err = err.toString()
          } else {
            valsi.saved = true
            valsi.numberAffected = numberAffected
          }
          resolve(valsi)
        })
      })
      prs.push(valsipromise)
      return Promise.all(prs)
    }).then((items) => {
      if (items[0].err || items[0].kunti || items[0].xaho) {
        return res.send(items[0])
      }
      const valsi_item = items.filter(i => i.type === 'valsi')
      if (valsi_item.length > 0) {
        return res.send({Valsi: valsi_item[0].item})
      }
    }).catch((err) => res.send({err: err.toString()}))
  })

  app.route('/api/sisku_satci').post((req, res) => {
    //todo: validator
    let opt = req.body
    const model_name = req.body.morna
    if (!model_name) {
      res.status(400).send({err: `db model not specified`})
      return
    }
    const model = require(`./models/${model_name}`)
    delete opt.morna
    Object.keys(opt).map(k => {
      if (!opt[k]) {
        opt[k] = undefined
      } else if (model.schema.obj[k] && model.schema.obj[k].ref) {
        opt[k] = mongoose.Types.ObjectId(opt[k])
      }
    })
    //model.find(opt, function(err, vlamei) {
    model.find(opt).populate('finti').populate('selgerna_filovalsi').populate('selgerna_filovelski').populate({path: 'terbri.klesi'}).populate({path: 'krasi.finti'}).populate({path: 'tcita.finti'}).populate({path: 'tcita.tcita'}).populate({path: 'jorne.finti'}).populate({path: 'jorne.felovelski'}).populate({path: 'jorne.tcita.finti'}).populate({path: 'jorne.tcita.tcita'}).lean().exec((err, vlamei) => {
      if (!vlamei)
        return res.send([])
      if (err)
        return res.status(400).send({err: err.message})
      let v = vlamei
      switch (model_name) {
        case "valsi":
          v = vlamei.map(i => {
            i = FlushPassword(i)
            return i
            //{valsi: i.valsi, finti: i.finti, _id: i._id}
          });
          break;
        case "language":
          v = vlamei
          break
      }
      res.send(v)
    })
  })

  app.route('/api/jmina_lebangu').post(isLoggedIn, (req, res) => {
    if (path([
      'body', 'krasi_cmene'
    ], req)) {
      const krasi_cmene = req.body.krasi_cmene
      const bridi = req.body.bridi
      Language.findOne({
        'krasi_cmene': krasi_cmene
      }, (err, lang) => {
        if (lang)
          return res.send({message: 'bangu already exists', Bangu: lang})
        if (err)
          res.send({err: `unknown database error when creating language "${krasi_cmene}"`})

          //now create a language
        Language.findOrCreate({
          "krasi_cmene": krasi_cmene,
          "isPredicateLanguage": bridi
        }, (err, lang) => {
          if (err)
            res.send({err: `unknown database error when creating language "${krasi_cmene}"`})
          return res.send({message: 'created a bangu', Bangu: lang})
        })
      })
    } else {
      //invalid body
      res.status(400).send({err: 'invalid body in post, did you include a krasi_cmene?'})
    }
  })

  app.route('/api/restorepass').post((req, res)=> {
    if (path([
      'body', 'userdatum'
    ], req)) {
      const nameoremail = req.body.userdatum
      //our new password
      const generator = require('generate-password')
      const password = generator.generate({length: 12, numbers: true, excludeSimilarCharacters: true})
      User.findOne({
        $or: [
          {
            'local.username': nameoremail
          }, {
            'local.email': nameoremail
          }
        ]
      }, (err, user) => {
        const now = new Date()
        const last = new Date(user.local.passwordLastRestored || 0)
        //can't restore more often than once a day
        if (((now - last) / (3600 * 1000)) <= 24)
          return res.send({sentemail: 'maybe sent something'})
        user.local.password = user.generateHash(password)
        user.local.passwordLastRestored = now
        user.save((err) => {
          if (err)
            return console.error(err)

            //send email
          const target_email = user.local.email
          const cmene = user.local.username
          const nodemailer = require('nodemailer')
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.email,
              pass: process.env.email_password
            }
          })
          const mailOptions = {
            from: `"Almavlaste ⇒ ${cmene}" <lengua.de.laguna@gmail.com>`,
            to: target_email,
            subject: `Your password is here.`,
            text: `${cmene}, you might have requested to change your password on Almavlaste. Currently it's not possible to select your new password manually so here is your new password from now on:\n\n${password}\n\nIf you didn't request restoring your password simply ignore this email.\n\n\nSincerely yours,\nAlmavlaste in action.`
          }

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error)
            } else {
              console.log('Email sent: ' + info.response)
            }
          })
          return res.send({sentemail: 'maybe sent something'})
        })
      })
    } else {
      res.status(400).send({err: 'didnt include userdatum'})
    }
  })

  app.route('/api/getalldefs/:id').get((req, res)=> {
    const user_id = req.params.id
    Valsi.find({
      finti: user_id
    }, (err, vlamei) => {
      if (err)
        return res.status(400).send({err: err.message})
      if (!vlamei)
        return res.send({err: `can't search in defs for a given user ${user_id}}`})
      const newDef = vlamei.map(i => {
        return {_id: i._id, valsi: i.valsi, terbri: i.terbri, finti: i.finti}
      })
      res.send(newDef)
    })
  })

  app.route('/api/listall').get((req, res)=> {
    Valsi.find({}, (err, vlamei) => {
      if (err)
        return res.status(400).send({err: err.message})
      if (!vlamei || vlamei.length === 0)
        return res.send({err: "empty Valsi database"})
      const newDef = vlamei.map(i => {
        return {_id: i._id, valsi: i.valsi, terbri: i.terbri, finti: i.finti}
      })
      res.send(newDef)
    })
  })

  app.route('/api/banmei').get((req, res)=> {
    Language.find({}).sort({freq: -1}).exec((err, banmei)=> {
      if (err)
        return res.status(400).send({err: err.message})
      if (!banmei || banmei.length === 0)
        return res.send({err: "empty bangu database"})
      res.send(banmei)
    })
  })

  app.route('/api/klemei').get((req, res)=> {
    Klesi.find({}).sort({freq: -1}).lean().exec((err, klemei)=> {
      if (err)
        return res.status(400).send({err: err.message})
      if (!klemei || klemei.length === 0)
        return res.send({err: "empty klemei database"})
      klemei = klemei.map(i => {
        if (!i.klesi)
          return
        return i
      }).filter(Boolean)
      res.send(klemei)
    })
  })

  app.route('/api/tcitymei').get((req, res)=> {
    Tcita.find({}).sort({freq: -1}).lean().exec((err, tcitymei)=> {
      if (err)
        return res.status(400).send({err: err.message})
      if (!tcitymei || tcitymei.length === 0)
        return res.send([])
      tcitymei = tcitymei.map(i => {
        if (!i.tcita)
          return
        return i
      }).filter(Boolean)
      res.send(tcitymei)
    })
  })

  app.route('/api/listusers').get((req, res)=> {
    User.find({}, (err, users) => {
      if (err)
        return res.status(400).send({err: err.message})
      if (!users || users.length === 0)
        return res.send({err: "empty Users database"})
      const plimei = users.map(i => {
        i.local.password = undefined
        return i
      })
      res.send(plimei)
    })
  })

  app.route('/api/pilno/:id').get((req, res)=> {
    const id = req.params.id
    User.findById(id, (err, user) => {
      if (err)
        return res.status(400).send({err: err.message})
      if (!user)
        return res.status(400).send({err: 'user not found'})
      user.local.password = undefined
      res.send(user)
    })
  })

  app.route('/api/bangu/:id').get((req, res)=> {
    const id = req.params.id
    Language.findById(id, (err, bangu) => {
      if (err)
        return res.status(400).send({err: err.message})
      if (!bangu)
        return res.status(400).send({err: 'bangu not found'})
      res.send(bangu)
    })
  })

  app.route('/api/valsibyname/:valsi').get((req, res)=> {
    const valsi = req.params.valsi
    Valsi.find({valsi: valsi}).populate('finti').populate({path: 'terbri.klesi'}).exec((err, valsi) => {
      if (err)
        return res.status(400).send({err: err.message})
      if (!valsi || valsi.length === 0)
        return res.status(400).send({err: 'valsi not found'})
      const newDef = valsi.map(i => {
        if (path([
          'finti', 'local'
        ], i)) {
          i["finti"]["local"]["password"] = undefined
          i["finti"]["local"]["passwordLastRestored"] = undefined
        }
        return {_id: i._id, valsi: i.valsi, terbri: i.terbri, finti: i.finti}
      })
      res.send(newDef)
    })
  })

  app.route('/api/valsi/:id').get((req, res)=> {
    const id = req.params.id
    Valsi.findById(id).populate('finti').populate({path: 'terbri.klesi'}).lean().exec((err, valsi)=> {
      if (err)
        return res.status(400).send({err: err.message})
      if (!valsi)
        return res.status(400).send({err: 'valsi not found'})
      const newDef = {
        _id: valsi._id,
        valsi: valsi.valsi,
        terbri: valsi.terbri.map(place => {
          if (place.klesi) {
            place.klesi = place.klesi.map(i => {
              if (i.klesi) {
                return i.klesi
              }
              return
            })
            return place
          }
          return
        }),
        finti: valsi.finti
      }
      if (path([
        'finti', 'local'
      ], newDef)) {
        newDef["finti"]["local"]["password"] = undefined
        newDef["finti"]["local"]["passwordLastRestored"] = undefined
      }
      res.send(newDef)
    })
  }).post((req, res)=> {
    /*@:id -> id of Valsi you are voting on
            * @body.option_id -> id of option you want to vote for
            * @body.option_id -> 'new', then a new option will be created
            * @body.option_text -> string of text if you are requesting a new option
             */
    if (!path([
      'body', 'option_id'
    ], req)) {
      res.status(400).send({err: 'invalid body, did not find body.option_id or body._id'})
      return console.error('invalid body in post to /api/Valsi/:id', req)
    }
    const def_id = req.params.id
    const option_id = req.body.option_id
    const user_id = req.body.user
    User.findById(user_id, (err, user)=> {
      if (err) {
        return console.error('user not found: ' + user_id)
      }
    })
    Valsi.findById(def_id, (err, Valsi) => {
      if (err)
        return res.status(400).send({err: err.message})

      if (option_id === 'new') {
        //voting for new option
        if (!req.isAuthenticated()) {
          res.status(401).send({err: 'you must be authenticated to add an option!'})
          return console.error('unauthenticated request to add option to Valsi', req)
        }
        if (!path([
          'body', 'option_text'
        ], req)) {
          res.status(400).send({err: 'new option was requested, but could not find body.option_text'})
          return console.error('invalid body in post to /api/Valsi/:id', req)
        }
        const option_text = req.body.option_text
        const new_option = {
          adza: option_text,
          votes: 1
        }
        Valsi.options.push(new_option)
      } else if (option_id === 'plus') {
        //adding upvote to the array of Valsi's upvotes
        if (Valsi.upvotes.filter(i => i.user === user_id).length > 0) { //array
          console.log('already voted ' + user_id)
        } else {
          Valsi.upvotes.push({user: user_id})
        }
      }

      Valsi.save((err)=> {
        if (err)
          return console.error(err)
        res.send(Valsi)
      })
    })
  })

  app.route('/api/login').get(isLoggedIn, (req, res)=> {
    const output = {
      user: req.user.toObject()
    }
    if (path([
      'user', 'local'
    ], req)) {
      output.user.local.password = '********' //don't send password to client
    }
    res.send(output)
  }).post(passport.authenticate('local-login'), (req, res)=> {
    //successfully signed up, if authentication failed client will get 401 error
    const output = {
      user: req.user.toObject()
    }
    output.user.local.password = '********' //don't send password to client
    res.send(output)
  })

  app.route('/api/logout').get((req, res)=> {
    req.logout()
    res.redirect('/')
  })

  app.route('/api/signup').post((req, res) => passport.authenticate('local-signup', (err, user, info)=> {
    //successfully signed up, if authentication failed client will get 404 error
    const output = {
      user, //: req.user.toObject(),
      message: info
        ? info.message
        : undefined
    }
    if (path([
      'local', 'password'
    ], req))
      output.user.local.password = '********' //don't send password to client
    res.send(output)
  })(req, res))

  /*
*
*
*
* Authorization routes
*
*
*/
  app.route('/auth/facebook').get(passport.authenticate('facebook'))

  app.route('/auth/facebook/callback').get(passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }))

  app.route('/auth/twitter').get(passport.authenticate('twitter'))

  app.route('/auth/twitter/callback').get(passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }))

  app.route('/auth/google').get(passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}))

  app.route('/auth/google/callback').get(passport.authenticate('google', {failureRedirect: '/login'}), (req, res)=> {
    res.redirect('/profile')
  })
  /*
 *
 *
 *
 * catch all route for frontend, react-routes will handle from here
 *
 *
 */
  app.use((req, res) => {
    match({
      routes: reactRoutes,
      location: req.url
    }, (err, redirect, props) => {
      // in here we can make some decisions all at once
      if (err) {
        // there was an error somewhere during route matching
        res.status(500).send(err.message)
      } else if (redirect) {
        // we haven't talked about `onEnter` hooks on routes, but before a
        // route is entered, it can redirect. Here we handle on the server.
        res.redirect(redirect.pathname + redirect.search)
      } else if (props) {
        // if we got props then we matched a route and can render
        const ReactMarkup = renderToString(<RouterContext {...props}/>)
        let authenticated = false
        if (req.user)
          authenticated = true
        res.render(path_.resolve('src/client/public/index.hbs'), {
          ReactMarkup: ReactMarkup,
          __AUTHENTICATED__: authenticated
        })
      } else {
        // no errors, no redirect, we just didn't match anything
        res.status(404).send('Not Found')
      }
    })
  })
  /*
    app.use((req, res)=>{
        let authenticated = false
        if(req.user) authenticated = true
        res.render(path_.resolve('src/client/public/index.hbs'),{__AUTHENTICATED__:authenticated})
    })
    */
}

module.exports = routes
