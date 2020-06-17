import React from 'react'
import ReactDom from 'react-dom'
import {Route,BrowserRouter,Switch} from 'react-router-dom'
import {Provider} from 'react-redux'

import store from './redux/store'
import Main from './containers/main/main'
import Register from './containers/register/register'
import Login from './containers/login/login'
import './assets/css/index.css'
ReactDom.render((
  <Provider store={store} >
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} ></Route>
        <Route path="/register" component={Register} ></Route>
        <Route component={Main} ></Route>
      </Switch>
    </BrowserRouter>
  </Provider>
),
  document.getElementById('root')
)