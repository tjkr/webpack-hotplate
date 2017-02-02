import React from 'react';
import { render } from 'react-dom';

import Header from './components/Header/Header';

const App = () => (
  <Header />
);

render(<App />, document.getElementById('app'));
