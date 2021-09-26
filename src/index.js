// import React from 'react';
import React from './react';
import ReactDOM from './react-dom';

// let element1 = (
//   <div className="title" style={{ color: 'red' }}>
//     <span>hello world</span>
//   </div>
// );

// let element2 = React.createElement(
//   'h1',
//   {
//     className: 'title',
//     style: {
//       color: 'red',
//     },
//   },
//   'hello',
//   React.createElement('span', {}, 'world')
// );
// ReactDOM.render(element2, document.getElementById('root'));

let FunctionComponent = (props) => (
  <div className="title" style={{ color: 'red' }}>
    <span>{props.name}</span>
    <span>{props.children}</span>
  </div>
);
ReactDOM.render(
  <FunctionComponent name="hello">world</FunctionComponent>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
