import { REACT_ELEMENT } from './constants';
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

  return {
    $$typeof: REACT_ELEMENT,
    type,
    ref,
    key,
    props,
  };
}

const React = {
  createElement,
  Component,
};

export default React;
