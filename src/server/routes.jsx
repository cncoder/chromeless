import React from 'react'
import {renderToString} from 'react-dom/server'
import {match, RouterContext} from 'react-router'
import reactRoutes from '../client/app/routes.jsx';
var path = require('path');
var _ = require('lodash');
const Lojban = require('lojban');
var Comment = require('./models/comments');
var Valsi = require('./models/valsi');
var Klesi = require('./models/klesi');
var Sentence = require('./models/mupli');
var Language = require('./models/languages');
var User = require('./models/users');
import {latexParser} from "latex-parser";

const p = (a) => console.log(JSON.stringify(a));

function SaveLanguage(options) {
  Language.findOne({
    '_id': options.bodypart
  }, function(err, lang) {
    if (err) {
      return {err: `the language with this id doesn't exist`};
    }
    if (options.gentufa && lang.krasi_cmene === 'lojban.') {
      const tcini = Lojban[options.gentufa](options.valsi)["tcini"];
      if (tcini === 'fliba') {
        return {err: 'not a lojban text'};
      }
    }
    if (!lang[options.freq] || !Number.isInteger(parseInt(lang[options.freq]))) {
      lang[options.freq] = 1;
    } else {
      lang[options.freq] = parseInt(lang[options.freq]) + 1;
    }
    lang.save(function(err) {
      if (err) {
        return {err: err.toString()};
      }
    });
  });
}

function SaveKlesi(oklesi) {
  Klesi.findOne({
    'klesi': oklesi
  }, function(err, klesi) {
    if (err) {
      return {err: `the klesi find/create error`};
    }
    if (!klesi) {
      klesi = new Klesi({freq: 1, klesi: oklesi});
    }
    if (!klesi["freq"] || !Number.isInteger(parseInt(klesi["freq"]))) {
      klesi["freq"] = 1;
    } else {
      klesi["freq"] = parseInt(klesi["freq"]) + 1;
    }
    klesi.save(function(err) {
      if (err) {
        return {err: err.toString()};
      }
    });
  });
}

var routes = function(app, passport) {
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      var output = {
        err: 'user is not authenticated'
      };
      res.status(401).send(output);
    }
  }
  /*
 *
 *
 *
 * API routes
 *
 *
 */

  app.route('/api/finti').post(isLoggedIn, function(req, res) {
    if (_.hasIn(req, 'body.valsi') && _.hasIn(req, 'body.terbri') && _.hasIn(req, 'body.bangu')) {
      var newDef = new Valsi();
      const arrterbri = JSON.parse(req.body.terbri);
      var terbri = [];
      for (let i in arrterbri) {
        const o = arrterbri[i];
        const parsed = latexParser.parse(o.sluji || '');
        //{"status":false,"index":{"offset":9,"line":1,"column":10},"expected":["'$'","'%'","'\\'","'\\begin'","'^'","'_'","'{'","text character"]}
        if (!parsed.status) {
          return res.send({err: "bad TeX", parsed: parsed});
        }
        if (o.idx === 0) {
          terbri.push({
            idx: parseInt(o.idx),
            sluji: o.sluji
          });
        } else if (o.klesi && (o.klesi !== '')) {
          terbri.push({
            idx: parseInt(o.idx),
            klesi: o.klesi,
            nirna: o.nirna,
            sluji: o.sluji
          });
        }
      }
      newDef.valsi = req.body.valsi;
      newDef.selgerna_filovalsi = req.body.bangu["value"];
      newDef.terbri = terbri;
      newDef.finti = req.user._id;
      newDef.tcita = JSON.parse(req.body.tcita) || [];
      newDef.tcita = newDef.tcita.map(i => {
        return {"finti": newDef.finti, "tcita": i.tcita};
      });
      newDef.save(function(err) {
        if (err)
          return console.error(3, err);
        const a = SaveLanguage({"bodypart": req.body["bangu"], "gentufa": "ilmentufa_off", "freq": "freq", "valsi": req.body["valsi"]});
        const b = SaveLanguage({"bodypart": req.body["terfanva"], "gentufa": false, "freq": "terfanva_freq", "valsi": req.body["valsi"]});
        if (a && a.err)
          return res.send(a);
        if (b && b.err)
          return res.send(b);
        terbri.map(o => {
          const c = SaveKlesi(o.klesi);
          if (c && с.err)
            return res.send(с);
          }
        );
        req.user.save(function(err) {
          if (err)
            return console.error(33, err);
          return res.send({Valsi: newDef});
        });
      });
    } else {
      //invalid body
      res.status(400).send({err: 'invalid body in post, did you include a valsi, language and terbri?'});
    }
  });

  app.route('/api/jmina_lebangu').post(isLoggedIn, function(req, res) {
    if (_.hasIn(req, 'body.krasi_cmene')) {
      const krasi_cmene = req.body.krasi_cmene;
      const bridi = req.body.bridi;
      Language.findOne({
        'krasi_cmene': krasi_cmene
      }, function(err, lang) {
        if (lang) {
          return res.send({message: 'bangu already exists', Bangu: lang});
        }
        if (err)
          res.send({err: `unknown database error when creating language "${krasi_cmene}"`});

        //now create a language
        Language.findOrCreate({
          "krasi_cmene": krasi_cmene,
          "isPredicateLanguage": bridi
        }, function(err, lang) {
          if (err)
            res.send({err: `unknown database error when creating language "${krasi_cmene}"`});
          return res.send({message: 'created a bangu', Bangu: lang});
        });
      });
    } else {
      //invalid body
      res.status(400).send({err: 'invalid body in post, did you include a krasi_cmene?'});
    }
  });

  app.route('/api/restorepass').post(function(req, res) {
    if (_.hasIn(req, 'body.userdatum')) {
      const nameoremail = req.body.userdatum;
      //our new password
      const generator = require('generate-password');
      const password = generator.generate({length: 12, numbers: true, excludeSimilarCharacters: true});
      User.findOne({
        $or: [
          {
            'local.username': nameoremail
          }, {
            'local.email': nameoremail
          }
        ]
      }, function(err, user) {
        const now = new Date();
        const last = new Date(user.local.passwordLastRestored || 0);
        //can't restore more often than once a day
        if (((now - last) / (3600 * 1000)) <= 24)
          return res.send({sentemail: 'maybe sent something'});
        user.local.password = user.generateHash(password);
        user.local.passwordLastRestored = now;
        user.save(function(err) {
          if (err)
            return console.error(err);

          //send email
          const target_email = user.local.email;
          const cmene = user.local.username;
          const nodemailer = require('nodemailer');
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.email,
              pass: process.env.email_password
            }
          });

          const mailOptions = {
            from: `"Almavlaste ⇒ ${cmene}" <lengua.de.laguna@gmail.com>`,
            to: target_email,
            subject: `Your password is here.`,
            text: `${cmene}, you might have requested to change your password on Almavlaste. Currently it's not possible to select your new password manually so here is your new password from now on:\n\n${password}\n\nIf you didn't request restoring your password simply ignore this email.\n\n\nSincerely yours,\nAlmavlaste in action.`
          };

          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          //res.send(user);
          return res.send({sentemail: 'maybe sent something'});
        });
      });
    } else {
      res.status(400).send({err: 'didnt include userdatum'});
    }
  });

  app.route('/api/getalldefs/:id').get(function(req, res) {
    const user_id = req.params.id;
    Valsi.find({
      finti: user_id
    }, function(err, vlamei) {
      if (err)
        return res.status(400).send({err: err.message});
      if (!vlamei)
        return res.send({err: `can't search in defs for a given user ${user_id}}`});
      var newDef = vlamei.map(i => {
        return {_id: i._id, valsi: i.valsi, terbri: i.terbri, finti: i.finti}
      });
      res.send(newDef);
    });
  });

  app.route('/api/listall').get(function(req, res) {
    Valsi.find({}, function(err, vlamei) {
      if (err)
        return res.status(400).send({err: err.message});
      if (!vlamei || vlamei.length === 0)
        return res.send({err: "empty Valsi database"});
      var newDef = vlamei.map(i => {
        return {_id: i._id, valsi: i.valsi, terbri: i.terbri, finti: i.finti}
      });
      res.send(newDef);
    });
  });

  app.route('/api/banmei').get(function(req, res) {
    Language.find({}).sort({freq: -1}).exec(function(err, banmei) {
      if (err)
        return res.status(400).send({err: err.message});
      if (!banmei || banmei.length === 0)
        return res.send({err: "empty bangu database"});
      res.send(banmei);
    });
  });

  app.route('/api/klemei').get(function(req, res) {
    Klesi.find({}).sort({freq: -1}).exec(function(err, klemei) {
      if (err)
        return res.status(400).send({err: err.message});
      if (!klemei || klemei.length === 0)
        return res.send({err: "empty klemei database"});
      klemei = klemei.map(i => {
        if (!i.klesi)
          return;
        return i;
      }).filter(Boolean);
      res.send(klemei);
    });
  });

  app.route('/api/listusers').get(function(req, res) {
    User.find({}, function(err, users) {
      if (err)
        return res.status(400).send({err: err.message});
      if (!users || users.length === 0)
        return res.send({err: "empty Users database"});
      const plimei = users.map(i => {
        i.local.password = undefined;
        return i;
      });
      res.send(plimei);
    });
  });

  app.route('/api/pilno/:id').get(function(req, res) {
    var id = req.params.id;
    User.findById(id, function(err, user) {
      if (err)
        return res.status(400).send({err: err.message});
      if (!user)
        return res.status(400).send({err: 'user not found'});
      user.local.password = undefined;
      // var FoundUser = {
      //   _id: user._id,
      //   cmene: user.local.username
      // };
      res.send(user);
    });
  });

  app.route('/api/bangu/:id').get(function(req, res) {
    var id = req.params.id;
    Language.findById(id, function(err, bangu) {
      if (err)
        return res.status(400).send({err: err.message});
      if (!bangu)
        return res.status(400).send({err: 'bangu not found'});
      res.send(bangu);
    });
  });

  app.route('/api/valsibyname/:valsi').get(function(req, res) {
    var valsi = req.params.valsi;
    Valsi.find({valsi: valsi}).populate('finti').exec(function(err, valsi) {
      if (err)
        return res.status(400).send({err: err.message});
      if (!valsi || valsi.length === 0)
        return res.status(400).send({err: 'valsi not found'});
      var newDef = valsi.map(i => {
        return {_id: i._id, valsi: i.valsi, terbri: i.terbri, finti: i.finti}
      });
      res.send(newDef);
    });
  });

  app.route('/api/valsi/:id').get(function(req, res) {
    var id = req.params.id;
    Valsi.findById(id, function(err, valsi) {
      if (err)
        return res.status(400).send({err: err.message});
      if (!valsi)
        return res.status(400).send({err: 'valsi not found'});
      var newDef = {
        _id: valsi._id,
        valsi: valsi.valsi,
        terbri: valsi.terbri,
        finti: valsi.finti
      };
      res.send(newDef);
    });
  }).post(function(req, res) {
    /*@:id -> id of Valsi you are voting on
            * @body.option_id -> id of option you want to vote for
            * @body.option_id -> 'new', then a new option will be created
            * @body.option_text -> string of text if you are requesting a new option
             */
    if (!_.hasIn(req, 'body.option_id')) {
      res.status(400).send({err: 'invalid body, did not find body.option_id or body._id'});
      return console.error('invalid body in post to /api/Valsi/:id', req);
    }
    var def_id = req.params.id;
    var option_id = req.body.option_id;
    var user_id = req.body.user;
    User.findById(user_id, function(err, user) {
      if (err) {
        return console.error('user not found: ' + user_id);
      }
    });
    Valsi.findById(def_id, function(err, Valsi) {
      if (err)
        return res.status(400).send({err: err.message});

      if (option_id === 'new') {
        //voting for new option
        if (!req.isAuthenticated()) {
          res.status(401).send({err: 'you must be authenticated to add an option!'});
          return console.error('unauthenticated request to add option to Valsi', req);
        }
        if (!_.hasIn(req, 'body.option_text')) {
          res.status(400).send({err: 'new option was requested, but could not find body.option_text'});
          return console.error('invalid body in post to /api/Valsi/:id', req);
        }
        var option_text = req.body.option_text;
        var new_option = {
          adza: option_text,
          votes: 1
        };
        Valsi.options.push(new_option);

      } else if (option_id === 'plus') {
        //adding upvote to the array of Valsi's upvotes
        if (Valsi.upvotes.filter(i => i.user === user_id).length > 0) { //array
          console.log('already voted ' + user_id);
        } else {
          Valsi.upvotes.push({user: user_id});
        }
      }

      Valsi.save(function(err) {
        if (err)
          return console.error(err);
        res.send(Valsi);
      });
    });
  });

  app.route('/api/login').get(isLoggedIn, function(req, res) {
    var output = {
      user: req.user.toObject()
    };
    if (_.hasIn(output, 'user.local')) {
      output.user.local.password = '********'; //don't send password to client
    }
    res.send(output);
  }).post(passport.authenticate('local-login'), function(req, res) {
    //successfully signed up, if authentication failed client will get 401 error
    var output = {
      user: req.user.toObject()
    };
    output.user.local.password = '********'; //don't send password to client
    res.send(output);
  });

  app.route('/api/logout').get(function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.route('/api/signup').post((req, res) => passport.authenticate('local-signup', function(err, user, info) {
    //successfully signed up, if authentication failed client will get 404 error
    var output = {
      user, //: req.user.toObject(),
      message: info
        ? info.message
        : undefined
    };
    if (_.hasIn(user, 'local.password'))
      output.user.local.password = '********'; //don't send password to client
    res.send(output);
  })(req, res));

  /*
*
*
*
* Authorization routes
*
*
*/
  app.route('/auth/facebook').get(passport.authenticate('facebook'));

  app.route('/auth/facebook/callback').get(passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }));

  app.route('/auth/twitter').get(passport.authenticate('twitter'));

  app.route('/auth/twitter/callback').get(passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }));

  app.route('/auth/google').get(passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}));

  app.route('/auth/google/callback').get(passport.authenticate('google', {failureRedirect: '/login'}), function(req, res) {
    res.redirect('/profile');
  });
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
        var authenticated = false;
        if (req.user)
          authenticated = true;
        res.render(path.resolve('src/client/public/index.hbs'), {
          ReactMarkup: ReactMarkup,
          __AUTHENTICATED__: authenticated
        });
      } else {
        // no errors, no redirect, we just didn't match anything
        res.status(404).send('Not Found')
      }
    });
  });
  /*
    app.use(function(req, res){
        var authenticated = false;
        if(req.user) authenticated = true;
        res.render(path.resolve('src/client/public/index.hbs'),{__AUTHENTICATED__:authenticated});
    });
    */

};

module.exports = routes;
