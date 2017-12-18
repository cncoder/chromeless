const AppDispatcher = require('../dispatcher/AppDispatcher')
const EventEmitter = require('events').EventEmitter
import request from 'superagent'
const assign = require('object-assign')

const CHANGE_EVENT = 'change'

let AppState = {
  user: {},
  userDefs: [],
  authenticated: false
}

//setter functions here
function setAppState(state) {
  AppState = assign({}, state)
}
function setUser(user) {
  AppState.user = user
  AppState.userDefs = [] //clear vlamei from previous user
  //todo: instead mongoose findall
  request.get('/api/getalldefs/' + user._id).end(function(err, res) {
    if (err)
      return console.error(err)
    AppState.userDefs = res.body
  })
}

function setAuthenticated(bool) {
  AppState.authenticated = bool
}
function emitChange() {
  AppStateStore.emit(CHANGE_EVENT)
}

const AppStateStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },
  getAppState: function() {
    return AppState
  },
  getUser: function() {
    return AppState.user
  },
  getUserDefs: function() {
    return AppState.userDefs
  },
  getAuthenticated: function() {
    return AppState.authenticated
  }
})

function handleAction(action) {
  switch (action.type) {
    case 'set_app_state':
      setAppState(action.state)
      emitChange()
      break
    case 'set_user':
      setUser(action.user)
      emitChange()
      break
    case 'set_authenticated':
      setAuthenticated(action.bool)
      emitChange()
      break
    default: // .. do nothing
  }
}

AppStateStore.dispatchToken = AppDispatcher.register(handleAction)
module.exports = AppStateStore
