import { REACT_ELEMENT, REACT_TEXT } from './constants';
import { addEvent } from './event';
/**
 * 将虚拟dom变成真实dom, 插入到容器内部
 * react的入口
 *
 * @param {*} vdom
 * @param {*} container
 */
function render(vdom, container) {
  mount(vdom, container);
}

/**
 * 挂载到父dom上
 *
 * @export
 * @param {*} vdom
 * @param {*} parentDOM
 */
export function mount(vdom, parentDOM) {
  let newDOM = createDOM(vdom);
  if (newDOM && parentDOM) {
    parentDOM.appendChild(newDOM);
  }
}

/**
 * 将虚拟dom转换成真实dom
 *
 * @export
 * @param {*} vdom
 * @return {*}
 */
export function createDOM(vdom) {
  if (!vdom) {
    return null;
  }

  let { type, props, $$typeof } = vdom;
  // 真实dom
  let dom;
  if ($$typeof === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else if (typeof type === 'function') {
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    }
    return mountFunctionComponent(vdom);
  } else if ($$typeof === REACT_ELEMENT) {
    dom = document.createElement(type);
  }

  if (props) {
    updateProps(dom, {}, props);
    if (props.children) {
      // 说明是个react-element
      if (typeof props.children == 'object' && props.children.type) {
        mount(props.children, dom);
      } else if (Array.isArray(props.children)) {
        reconcileChildren(props.children, dom);
      }
    }
  }

  vdom.dom = dom;
  return dom;
}

/**
 * 处理类组件
 *
 * @param {*} vdom
 */
function mountClassComponent(vdom) {
  let { type: ClassComponent, props } = vdom;
  let classInstance = new ClassComponent(props);
  let renderVdom = classInstance.render();
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

/**
 * 处理函数组件, vdom转成dom
 *
 * @param {*} vdom
 */
function mountFunctionComponent(vdom) {
  let { type, props } = vdom;
  let renderVdom = type(props);
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

/**
 * 更新属性, 将新的属性更新到真实dom上
 *
 * @param {*} dom
 * @param {*} [oldProps={}]
 * @param {*} [newProps={}]
 */
function updateProps(dom, oldProps = {}, newProps = {}) {
  for (let key in newProps) {
    if (key === 'children' || key === 'content') {
      // 忽略子节点处理, 子节点会单独处理
      continue;
    } else if (key === 'style') {
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (key.startsWith('on')) {
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
      // dom[key.toLocaleLowerCase()] = newProps[key];
    } else {
      dom[key] = newProps[key];
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
export function findDOM(vdom) {
  if (!vdom) return null;
  if (vdom.dom) {
    return vdom.dom;
  } else {
    return findDOM(vdom.oldRenderVdom);
  }
}

/**
 * dom-diff, 比较新旧Vdom的差异, 然后将差异同步到真实DOM上
 *
 * @export
 * @param {*} parentNode
 * @param {*} oldVdom
 * @param {*} newVdom
 */
export function compareTwoVdom(parentNode, oldVdom, newVdom) {
  let oldDOM = findDOM(oldVdom);
  let newDOM = createDOM(newVdom);
  parentNode.replaceChild(newDOM, oldDOM);
}

const ReactDOM = {
  render,
};

export default ReactDOM;
