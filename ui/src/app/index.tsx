import React from 'react';
import { Route, Switch } from 'react-router';
import { App as ImageTilerApp } from 'app/containers/App';
import { App as TodoApp } from 'app/containers/TodoApp';
import { hot } from 'react-hot-loader';

export const App = hot(module)(() => (
  <Switch>
    <Route path="/todo" component={TodoApp} />
    <Route path="/:level" component={ImageTilerApp} />
    <Route path="/" component={ImageTilerApp} />
  </Switch>
));
