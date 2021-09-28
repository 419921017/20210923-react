import { updateQueue } from './component';
/**
 * 合成事件和事件委托
 * react17之前会将所有事件都挂载到dom上
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
  // 创建合成事件
  let syntheticEvent = createSyntheticEvent(event);

  let currentTarget = target;
  // 模拟向上冒泡的过程
  while (currentTarget) {
    let { store } = currentTarget;
    let eventHandler = store && store[eventType];

    if (eventHandler) {
      syntheticEvent.target = target;
      syntheticEvent.currentTarget = currentTarget;
      eventHandler.call(target, syntheticEvent);
    }

    currentTarget = currentTarget.parentNode;
  }

  // 批量执行, 开始更新
  updateQueue.batchUpdate();
  // batchUpdate完成后会将isBatchingUpdate设置为false
  // updateQueue.isBatchingUpdate = false;
}

/**
 * 根据原生事件创建合成事件
 *
 * @param {*} nativeEvent
 */
function createSyntheticEvent(nativeEvent) {
  // 原生对象的信息
  let syntheticEvent = { nativeEvent };
  for (const key in nativeEvent) {
    // NOTE: 省略兼容性处理
    syntheticEvent[key] = nativeEvent[key];
  }
  return syntheticEvent;
}
