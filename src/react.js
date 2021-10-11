import {
  REACT_CONTEXT,
  REACT_ELEMENT,
  REACT_FORWARD_REF,
  REACT_FRAGMENT,
  REACT_MEMO,
  REACT_PROVIDER,
} from './constants';
import { shallowEquals } from './utils';
import { wrapToVdom } from './utils';
import Component from './component';

/**
 * 创建虚拟DOM, React Element
 *
 * @param {*} type      元素的类型, div, span
 * @param {*} config    配置对象, className, style
 * @param {*} children  子元素, 一个或者多个
 * @return {*}
 */
function createElement(type, config, children) {
  let ref;
  let key;
  if (config) {
    // diff算法有用
    delete config.__source;
    delete config.__self;
    ref = config.ref;
    key = config.key;
    delete config.ref;
    delete config.key;
  }
  let props = {
    ...config,
  };

  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    props.children = wrapToVdom(children);
  }

  // react元素
  return {
    $$typeof: REACT_ELEMENT,
    type,
    ref,
    key,
    props,
  };
}

function createRef() {
  return {
    current: null,
  };
}

/**
 *
 *
 * @param {*} render 函数组件
 * @return {*}
 */
function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render,
  };
}

function createContext() {
  let context = {
    $$typeof: REACT_CONTEXT,
    _currentValue: null,
  };
  context.Customer = {
    $$typeof: REACT_CONTEXT,
    _context: context,
  };
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context,
  };
  return context;
}

class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEquals(this.props, nextProps) ||
      !shallowEquals(this.state, nextState)
    );
  }
}

function memo(type, compare = shallowEquals) {
  return {
    $$typeof: REACT_MEMO,
    type,
    compare,
  };
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  Fragment: REACT_FRAGMENT,
  createContext,
  PureComponent,
  memo,
};

export default React;
