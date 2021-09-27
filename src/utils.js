import { REACT_TEXT } from './constants';

/**
 * 将任意元素包装成虚拟dom
 *
 * @export
 * @param {*} element
 * @return {*}
 */
export function wrapToVdom(element) {
  return typeof element === 'string' || typeof element === 'number'
    ? {
        $$typeof: REACT_TEXT,
        type: REACT_TEXT,
        props: { content: element },
      }
    : element;
}

export function isFunction(obj) {
  return typeof obj === 'function';
}
