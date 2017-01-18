import React from 'react';
import ReactDOM from 'react-dom';
import Module from './modules/module';

const App = () => <Module name={'World'} />;

ReactDOM.render(<App />, document.getElementById('app'));
