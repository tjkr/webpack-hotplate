import React from 'react';
import ReactDOM from 'react-dom';
import Module from './modules/module';
import Module2 from './modules/module2';

const App = () => {
  return (
    <div>
      <Module name={'World'} />
      <Module2 />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
