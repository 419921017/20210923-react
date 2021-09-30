import React from 'react';
import ReactDOM from 'react-dom';

// import React from './react';
// import ReactDOM from './react-dom';

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

// class CC extends React.Component {
//   render() {
//     return (
//       <div className="title" style={{ color: 'pink' }}>
//         <span>{this.props.name}</span>
//         <span>{this.props.children}</span>
//       </div>
//     );
//   }
// }

// let ele = React.createElement(
//   CC,
//   {
//     name: 'hello',
//   },
//   '123'
// );

// ReactDOM.render(ele, document.getElementById('root'));

// class Counter extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       number: 0,
//     };
//   }
//   handleClick = (e) => {
//     console.log(e);
//     this.setState({ number: this.state.number + 1 });
//     console.log(this.state);
//   };
//   render() {
//     return (
//       <div>
//         <p>{this.props.title}</p>
//         <p>number: {this.state.number}</p>
//         <button onClick={this.handleClick}>+</button>
//       </div>
//     );
//   }
// }

// let ele = React.createElement(Counter, {
//   title: '老标题',
// });
// ReactDOM.render(ele, document.getElementById('root'));

// class Sum extends React.Component {
//   a;
//   b;
//   result;
//   constructor(props) {
//     super(props);
//     this.a = React.createRef();
//     this.b = React.createRef();
//     this.result = React.createRef();
//   }
//   handleAdd = () => {
//     let a = this.a.current.value;
//     let b = this.b.current.value;
//     this.result.current.value = a + b;
//   };
//   render() {
//     return (
//       <>
//         <input ref={this.a} />+<input ref={this.b} />
//         <button onClick={this.handleAdd}>=</button>
//         <input ref={this.result} />
//       </>
//     );
//   }
// }
// ReactDOM.render(<Sum />, document.getElementById('root'));

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: ['A', 'B', 'C', 'D', 'E', 'F'],
    };
  }
  handleClick = () => {
    this.setState({
      list: ['A', 'C', 'E', 'B', 'G'],
    });
  };
  render() {
    return (
      <React.Fragment>
        <ul>
          {this.state.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button onClick={this.handleClick}></button>
      </React.Fragment>
    );
  }
}
