import { REACT_ELEMENT, REACT_TEXT } from './constants';

function render(vdom, container) {
  mount(vdom, container);
}

export function mount(vdom, container) {
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
}

export function createDOM(vdom) {
  let { type, props } = vdom;
  let dom;
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else if (type === REACT_ELEMENT) {
    dom = document.createElement(type);
  }

  if (props) {
    updateProps(dom, {}, props);
    // 说明是个react-element
    if (typeof props.children == 'object' && props.children.type) {
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }
}

function updateProps(dom, oldProps = {}, newProps = {}) {
  for (const key in newProps) {
    if (key === 'children') {
      continue;
    } else if (key === 'style') {
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    }
  }

  for (let key in oldProps) {
    if (!newProps.hasOwnProperty(key)) {
      dom[key] = null;
    }
  }
}

function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    const childVdom = childrenVdom[i];
    mount(childVdom, parentDOM);
  }
}

const ReactDOM = {
  render,
};

export default ReactDOM;
