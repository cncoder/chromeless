import request from 'superagent';
import {setUser, setAuthenticated} from '../actions/AppStateActionCreators.js';
import {getAuthenticated} from '../stores/AppStateStore';

var checkAuthenticationAPI = function() {
  request.get('/api/login').end(function(err, res) {
    if (err)
      return console.warn(err);
    if (res.body.user) {
      setUser(res.body.user);
      setAuthenticated(true);
    } else {
      setUser(null);
      setAuthenticated(false);
    }
  });
};

var checkAuthenticationLocal = function(nextState, replace) {
  console.log('checking authentication');
  if (!getAuthenticated()) {
    replace({
      pathname: '/login',
      state: {
        nextPathname: nextState.location.pathname
      }
    });
  }
};

var getRandomDef = function(cb) {
  console.log('getting random word');
  request.get('/api/valsi/random').end(function(err, res) {
    if (err)
      return cb(err);
    console.log('valsi returned:', res.body);
    return cb(null, res.body);
  });
};

var getAllUsers = function(cb) {
  console.log('getting all users');
  request.get('/api/listusers').end(function(err, res) {
    if (err)
      return cb(err);

    //console.log('users returned:',JSON.stringify(res.body));
    return cb(null, res.body);
  });
};

var getAllBangu = function(cb) {
  console.log('getting all bangu');
  request.get('/api/banmei').end(function(err, res) {
    if (err)
      return cb(err);
    return cb(null, res.body);
  });
};

var getAllKlesi = function(cb) {
  console.log('getting all klesi');
  request.get('/api/klemei').end(function(err, res) {
    if (err)
      return cb(err);
    return cb(null, res.body);
  });
};

var getAllDefs = function(cb) {
  console.log('getting all vlamei');
  request.get('/api/listall').end(function(err, res) {
    if (err)
      return cb(err);

    //console.log('vlamei returned:',JSON.stringify(res.body));
    return cb(null, res.body);
  });
};

var getDefsFromUserId = function(id, cb) {
  console.log('getting all vlamei from id');
  request.get('/api/getalldefs/' + id).end(function(err, res) {
    if (err)
      return cb(err);
    return cb(null, res.body);
  });
};

var getDefById = function(id, cb) {
  console.log('getDefById:', id);
  request.get('/api/valsi/' + id).end(function(err, res) {
    if (err)
      return cb(err);
    console.log('valsi returned:', res.body);
    return cb(null, res.body);
  });
};

var getDefByName = function(valsi, cb) {
  console.log('getDefByName:', valsi);
  request.get('/api/valsibyname/' + valsi).end(function(err, res) {
    if (err)
      return cb(err);
    //console.log('valsi returned:', JSON.stringify(res.body));
    return cb(null, res.body);
  });
};

var getUserById = function(id, cb) {
  console.log('getUserById:', id);
  request.get('/api/pilno/' + id).end(function(err, res) {
    if (err)
      return cb(err);
    console.log('user returned:', res.body);
    return cb(null, res.body);
  });
}
var getBanguById = function(id, cb) {
  console.log('getBanguById:', id);
  request.get('/api/bangu/' + id).end(function(err, res) {
    if (err)
      return cb(err);
    console.log('bangu returned:', res.body);
    return cb(null, res.body);
  });
}

var echo = function(msg) {
  console.log('echo():', msg);
}

module.exports = {
  checkAuthenticationAPI,
  checkAuthenticationLocal,
  getRandomDef,
  getAllDefs,
  getAllBangu,
  getAllKlesi,
  getAllUsers,
  getDefById,
  getDefsFromUserId,
  getDefByName,
  getUserById,
  getBanguById,
  echo
};
