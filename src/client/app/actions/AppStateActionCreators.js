const AppDispatcher = require('../dispatcher/AppDispatcher');

function setAppState(state){
    const action = {
        type: 'set_app_state',
        state: state
    };
    AppDispatcher.dispatch(action);
}
function setUser(user){
    const action = {
        type: 'set_user',
        user: user
    };
    AppDispatcher.dispatch(action);
}
function setAuthenticated(bool){
    const action = {
        type: 'set_authenticated',
        bool: bool
    };
    AppDispatcher.dispatch(action);
}

module.exports = {
    setAppState: setAppState,
    setUser: setUser,
    setAuthenticated: setAuthenticated
};
