import { REACT_ELEMENT, REACT_FORWARD_REF, REACT_TEXT } from './constants';
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
    if (newDOM._componentDidMount) newDOM._componentDidMount();
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

  let { type, props, $$typeof, ref } = vdom;
  // 真实dom
  let dom;
  if (type && type.$$typeof === REACT_FORWARD_REF) {
    return mountForwardComponent(vdom);
  } else if ($$typeof === REACT_TEXT) {
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
  // 原生DOM中有个ref, ref指向DOM实例
  if (ref) {
    ref.current = dom;
  }
  return dom;
}

function mountForwardComponent(vdom) {
  let { type, props, ref } = vdom;
  let renderVdom = type.render(props, ref);

  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

/**
 * 处理类组件
 *
 * @param {*} vdom
 */
function mountClassComponent(vdom) {
  let { type: ClassComponent, props, ref } = vdom;
  let classInstance = new ClassComponent(props);
  // 设置ref值为类组件实例
  if (ref) ref.current = classInstance;

  // 判断是否存在componentWillMount
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount();
  }

  vdom.classInstance = classInstance;

  let renderVdom = classInstance.render();
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom;

  // 将类组件实例render方法返回的虚拟dom转变成真是dom
  let dom = createDOM(renderVdom);
  if (classInstance.componentDidMount) {
    dom._componentDidMount =
      classInstance.componentDidMount.bind(classInstance);
  }
  return dom;
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
 * 1. 老新都为null
 * 2. 老有新没有
 * 3. 老没有新有
 * 4. 老新都有
 *
 * @export
 * @param {*} parentNode
 * @param {*} oldVdom
 * @param {*} newVdom
 * @param {*} nextVdom
 */
export function compareTwoVdom(parentNode, oldVdom, newVdom, nextDOM) {
  // let oldDOM = findDOM(oldVdom);
  // let newDOM = createDOM(newVdom);
  // parentNode.replaceChild(newDOM, oldDOM);
  if (!oldVdom && !newVdom) {
    return null;
  } else if (!!oldVdom && !newVdom) {
    unMountVdom(oldVdom);
  } else if (!oldVdom && newVdom) {
    let newDOM = createDOM(newVdom);
    // mount(newVdom, parentNode);
    if (nextDOM) {
      parentNode.insetBefore(newDOM, nextDOM);
    } else {
      parentNode.appendChild(newDOM);
    }
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    unMountVdom(oldVdom);
    // mount(newVdom, parentNode);
    let newDOM = createDOM(newVdom);
    // mount(newVdom, parentNode);
    if (nextDOM) {
      parentNode.insetBefore(newDOM, nextDOM);
    } else {
      parentNode.appendChild(newDOM);
    }
    if (newDOM._componentDidMount) newDOM._componentDidMount();
  } else {
    updateElement(oldVdom, newVdom);
  }
}

/**
 * 深度更新节点
 *
 * @param {*} oldVdom
 * @param {*} newVdom
 */
function updateElement(oldVdom, newVdom) {
  if (oldVdom.$$typeof === REACT_TEXT) {
    if (oldVdom.props.content !== newVdom.props.content) {
      let currentDOM = (newVdom.dom = findDOM(oldVdom));

      currentDOM.textContent = newVdom.props.content;
    }
    // 原生元素
  } else if (typeof oldVdom.type === 'string') {
    // 获取旧的真实dom, 准备复用
    let currentDOM = (newVdom.dom = findDOM(oldVdom));
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === 'function') {
    if (oldVdom.type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom);
    } else {
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}

/**
 * 更新类组件
 *
 * @param {*} oldVdom
 * @param {*} newVdom
 */
function updateClassComponent(oldVdom, newVdom) {
  let classInstance = (newVdom.classInstance = oldVdom.classInstance);
  let oldRenderVdom = (newVdom.oldRenderVdom = oldVdom.oldRenderVdom);
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps(newVdom.props);
  }
  classInstance.updater.emitUpdate(newVdom.props);
}

/**
 * 更新函数组件
 *
 * @param {*} oldVdom
 * @param {*} newVdom
 */
function updateFunctionComponent(oldVdom, newVdom) {
  let currentDOM = findDOM(oldVdom);
  let parentDOM = currentDOM.parentNode;
  let { type, props } = newVdom;
  let newRenderVdom = type(props);
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
  newVdom.oldRenderVdom = newRenderVdom;
}

/**
 * 更新子节点
 *
 * @param {*} parentDOM
 * @param {*} oldVChildren
 * @param {*} newVChildren
 */
function updateChildren(parentDOM, oldVChildren, newVChildren) {
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];
  let maxChildrenLength = Math.max(oldVChildren.length, newVChildren.length);
  for (let i = 0; i < maxChildrenLength.length; i++) {
    // 取出当前节点的下一个, 最近弟弟的真实DOM节点
    let nextVdom = oldVChildren.find(
      (item, index) => index > i && item && findDOM(item)
    );
    compareTwoVdom(
      parentDOM,
      oldVChildren[i],
      newVChildren[i],
      findDOM(nextVdom)
    );
  }
}

function unMountVdom(vdom) {
  let { props, ref } = vdom;
  let currentDOM = findDOM(vdom);
  if (vdom.classInstance && vdom.classInstance.componentWillUnmount) {
    vdom.classInstance.componentWillUnmount();
  }
  if (ref) {
    ref.current = null;
  }
  Object.keys(props).forEach((propName) => {
    // 绑定真实dom, 需要这样处理
    if (propName.slice(0, 2) === 'on') {
      //   const eventName = props.slice(2).toLocaleLowerCase();
      //   currentDOM.removeEventListener(eventName, props[propName]);
      // 合成事件, 直接删除
      delete currentDOM.store;
    }
  });
  if (props.children) {
    let children = Array.isArray(props.children)
      ? props.children
      : [props.children];
    children.forEach((child) => unMountVdom(child));
  }
  currentDOM.parentNode.removeChild(currentDOM);
}

const ReactDOM = {
  render,
};

export default ReactDOM;
