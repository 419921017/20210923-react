import { updateQueue } from './component';
/**
 * 合成事件和事件委托
 *
 * @export
 * @param {*} dom
 * @param {*} eventType
 * @param {*} eventHandler
 */
export function addEvent(dom, eventType, eventHandler) {
  let store;
  if (dom.store) {
    store = dom.store;
  } else {
    dom.store = {};
    store = dom.store;
  }
  store[eventType] = eventHandler;
  if (!document[eventType]) {
    document[eventType] = dispatchEvent;
  }
}

/**
 * 不管点什么, 触发什么时间, 最终执行的都是dispatchEvent
 *
 * @param {*} event 原生的事件对象, 不同浏览器可能不同
 */
function dispatchEvent(event) {
  let { target, type } = event;
  let eventType = `on${type}`;
  // 暂停更新
  updateQueue.isBatchingUpdate = true;

  let syntheticEvent = createSyntheticEvent(event);
  let { store } = target;
  let eventHandler = store && store[eventType];
  eventHandler && eventHandler.call(target, syntheticEvent);

  // 批量执行, 开始更新
  updateQueue.batchUpdate();
}

/**
 * 根据原生事件创建合成事件
 *
 * @param {*} nativeEvent
 */
function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = {};
  for (const key in nativeEvent) {
    // NOTE: 省略兼容性处理
    syntheticEvent[key] = nativeEvent[key];
  }
  return syntheticEvent;
}
