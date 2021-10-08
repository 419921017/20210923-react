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

// class Counter extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       list: ['A', 'B', 'C', 'D', 'E', 'F'],
//     };
//   }
//   handleClick = () => {
//     this.setState({
//       list: ['A', 'C', 'E', 'B', 'G'],
//     });
//   };
//   render() {
//     return (
//       <React.Fragment>
//         <ul>
//           {this.state.list.map((item) => (
//             <li key={item}>{item}</li>
//           ))}
//         </ul>
//         <button onClick={this.handleClick}></button>
//       </React.Fragment>
//     );
//   }
// }
// ReactDOM.render(<Counter />, document.getElementById('root'));
// let ThemeContext = React.createContext();
// class Header extends React.Component {
//   static contextType = ThemeContext;
//   render() {
//     return (
//       <div
//         style={{
//           margin: 10,
//           border: `5px solid ${this.context.color}`,
//           padding: '5px',
//         }}
//       >
//         Header{this.props.children}
//       </div>
//     );
//   }
// }

// function Header(props) {
//   return (
//     <ThemeContext.Consumer>
//       {(value) => (
//         <div
//           style={{
//             margin: 10,
//             border: `5px solid ${value.color}`,
//             padding: '5px',
//           }}
//         >
//           Header{props.children}
//         </div>
//       )}
//     </ThemeContext.Consumer>
//   );
// }
// class Title extends React.Component {
//   static contextType = ThemeContext;

//   render() {
//     return (
//       <div
//         style={{
//           margin: 10,
//           border: `5px solid ${this.context.color}`,
//           padding: '5px',
//         }}
//       >
//         Title{this.props.children}
//       </div>
//     );
//   }
// }
// class Main extends React.Component {
//   static contextType = ThemeContext;
//   render() {
//     return (
//       <div
//         style={{
//           margin: 10,
//           border: `5px solid ${this.context.color}`,
//           padding: '5px',
//         }}
//       >
//         Main{this.props.children}
//       </div>
//     );
//   }
// }
// class Content extends React.Component {
//   static contextType = ThemeContext;
//   render() {
//     return (
//       <div
//         style={{
//           margin: 10,
//           border: `5px solid ${this.context.color}`,
//           padding: '5px',
//         }}
//       >
//         content
//         <button onClick={() => this.context.changeColor('red')}>red</button>
//         <button onClick={() => this.context.changeColor('green')}>green</button>
//         {this.props.children}
//       </div>
//     );
//   }
// }

// class Page extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { color: 'red' };
//   }
//   changeColor = (color) => {
//     this.setState({
//       color,
//     });
//   };
//   render() {
//     let value = { color: this.state.color, changeColor: this.changeColor };
//     return (
//       <ThemeContext.Provider value={value}>
//         <div
//           style={{
//             margin: 10,
//             border: `5px solid ${this.state.color}`,
//             padding: '5px',
//           }}
//         >
//           <Header>
//             <Title></Title>
//           </Header>
//         </div>
//         <div
//           style={{
//             margin: 10,
//             border: `5px solid ${this.state.color}`,
//             padding: '5px',
//           }}
//         >
//           <Main>
//             <Content></Content>
//           </Main>
//         </div>
//       </ThemeContext.Provider>
//     );
//   }
// }

// ReactDOM.render(<Page />, document.getElementById('root'));

// const withLoading = (loading) => (OldComponent) => {
//   return class extends React.Component {
//     render() {
//       let state = {
//         show: () => {
//           console.log('show');
//         },
//         hide: () => {
//           console.log('hide');
//         },
//       };
//       return <OldComponent {...this.props} {...state}></OldComponent>;
//     }
//   };
// };

// class Hello extends React.Component {
//   render() {
//     return (
//       <div>
//         {this.props.title}
//         <button onClick={this.props.show}>show</button>
//         <button onClick={this.props.hide}>hide</button>
//       </div>
//     );
//   }
// }

// let HelloWithLoading = withLoading('...loading')(Hello);
// ReactDOM.render(
//   <HelloWithLoading title="标题" />,
//   document.getElementById('root')
// );

// class Button extends React.Component {
//   state = { name: '张三' };
//   render() {
//     return <button name={this.state.name} title={this.props.title}></button>;
//   }
// }

// const wrapper = (OldComponent) => {
//   return class extends OldComponent {
//     state = { ...this.state, number: 0 };
//     handleClick = () => {
//       this.setState({ number: this.state.number + 1 });
//     };
//     render() {
//       let renderVdom = super.render();
//       let newProps = {
//         ...renderVdom.props,
//         ...this.state,
//         onClick: this.handleClick,
//       };
//       return React.cloneElement(
//         renderVdom,
//         newProps,
//         this.state.name,
//         this.state.number
//       );
//     }
//   };
// };

// NOTE: 装饰器, 需要添加jsconfig和babel支持
// @wrapper
// class Button extends React.Component {
//   state = { name: '张三' };
//   render() {
//     return <button name={this.state.name} title={this.props.title}></button>;
//   }
// }
// // let WrappedButton = wrapper(Button);

// ReactDOM.render(
//   <Button title="标题"></Button>,
//   document.getElementById('root')
// );
