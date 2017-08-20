import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/layout.jsx';
import Login from './components/pages/login.jsx';
import LostPass from './components/pages/lostpass.jsx';
import Signup from './components/pages/signup.jsx';
import Finti from './components/pages/finti.jsx';
import JBangu from './components/pages/jbangu.jsx';
import Valsi from './components/pages/valsi.jsx';
import SmuvelckiByName from './components/pages/SmuvelckiByName.jsx';
import ListAll from './components/pages/listall.jsx';
import Sisku from './components/pages/sisku.jsx';
import ListUsers from './components/pages/listusers.jsx';
import Profile from './components/pages/profile.jsx';
import Pilno from './components/pages/pilno.jsx';
import Bangu from './components/pages/bangu.jsx';
import NotFound from './components/pages/notfound.jsx';
import Fihi from './components/pages/fihi.jsx';
import { checkAuthenticationLocal } from './utils/utils';


module.exports = (
    <Route path="/" component={Layout} >
        <IndexRoute component={Fihi} />
        <Route path="/valsi" component={ListAll} />
        <Route path="/sisku" component={Sisku} />
        <Route path="/lostpass" component={LostPass} />
        <Route path="/listall" component={ListAll} />
        <Route path="/pilno" component={ListUsers} />
        <Route path="/valsi/:id" component={Valsi} />
        <Route path="/dict/:valsi" component={SmuvelckiByName} />
        <Route path="/pilno/:id" component={Pilno} />
        <Route path="/bangu/:id" component={Bangu} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/finti" component={Finti} />
        <Route path="/jbangu" component={JBangu} />
        <Route path="/profile" component={Profile} onEnter={ checkAuthenticationLocal }/>
        <Route path="*" component={NotFound} />
    </Route>
);
