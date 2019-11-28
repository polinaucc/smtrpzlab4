import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Shop from './components/Shop'
import AdminComponent from './components/Admin'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={Shop} />
      <Route path='/admin' component={AdminComponent} />
    </Switch>
  </BrowserRouter>
);

export default App;
