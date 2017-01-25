import React from 'react';
import ReactDOM from 'react-dom';
import Module from './modules/module';
import Module2 from './modules/module2';

const App = () => (
  <div>
    <Module />
    <Module2 />
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
