import React from 'react';
import { render } from 'react-dom';

import Header from './components/Header';

const App = () => (
  <Header>webpack-hotplate</Header>
);

render(<App />, document.getElementById('app'));
