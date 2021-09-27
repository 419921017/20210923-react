import { createDOM, findDOM, compareTwoVdom } from './react-dom';

export let updateQueue = {
  isBatchingUpdate: false,
  updaters: [],
  batchUpdate() {
    for (const updater of updateQueue.updaters) {
      updater.updateComponent();
    }
    updateQueue.updaters.length = 0;
    updateQueue.isBatchingUpdate = false;
  },
};

export default class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this);
  }
  setState(partialState) {
    this.updater.addState(partialState);
  }

  /**
   * 根据新的属性和状态更新组件
   *
   * @memberof Component
   */
  forceUpdate() {
    let oldRenderVdom = this.oldRenderVdom;
    // 不太严谨
    // let oldDOM = oldRenderVdom.dom;
    let oldDOM = findDOM(oldRenderVdom);
    let newRenderVdom = this.render();
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
    // 将老的真实DOM替换为新的真实DOM
    this.oldRenderVdom = newRenderVdom;
  }
}

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = [];
    this.callbacks = [];
  }
  addState(partialState) {
    this.pendingStates.push(partialState);
    this.emitUpdate();
  }
  emitUpdate() {
    // 可能是同步更新, 可能是异步批量更新
    if (updateQueue.isBatchingUpdate) {
      // 异步批量更新
      updateQueue.updaters.push(this);
    } else {
      // 同步更新
      this.updateComponent();
    }
  }
  updateComponent() {
    const { classInstance, pendingStates } = this;
    if (pendingStates.length > 0) {
      shouldUpdate(classInstance, this.getState());
    }
  }
  getState() {
    const { classInstance, pendingStates } = this;
    let { state } = classInstance;
    pendingStates.forEach((partialState) => {
      if (typeof partialState == 'function') {
        partialState = partialState(state);
      }
      state = { ...state, ...partialState };
    });
    pendingStates.length = 0;
    return state;
  }
}

function shouldUpdate(classInstance, nextState) {
  classInstance.state = nextState;
  classInstance.forceUpdate();
}
