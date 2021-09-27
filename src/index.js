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

// let FunctionComponent = (props) => (
//   <div className="title" style={{ color: 'red' }}>
//     <span>{props.name}</span>
//     <span>{props.children}</span>
//   </div>
// );
// ReactDOM.render(
//   <FunctionComponent name="hello">world</FunctionComponent>,
//   document.getElementById('root')
// );

class CC extends React.Component {
  render() {
    return (
      <div className="title" style={{ color: 'pink' }}>
        <span>{this.props.name}</span>
        <span>{this.props.children}</span>
      </div>
    );
  }
}

let ele = React.createElement(
  CC,
  {
    name: 'hello',
  },
  '123'
);

ReactDOM.render(ele, document.getElementById('root'));
