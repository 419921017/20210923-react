import React from 'react';
import ReactDOM from 'react-dom';

let element1 = (
  <div className="title" style={{ color: 'red' }}>
    <span>hello world</span>
  </div>
);

ReactDOM.render(element1, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
