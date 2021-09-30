import { findDOM, compareTwoVdom } from './react-dom';

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
    if (this.constructor.getDerivedStateFromProps) {
      let newState = this.constructor.getDerivedStateFromProps(
        this.props,
        this.state
      );
      if (newState) {
        this.state = newState;
      }
    }
    let newRenderVdom = this.render();
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
    // 将老的真实DOM替换为新的真实DOM
    this.oldRenderVdom = newRenderVdom;

    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state);
    }
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
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
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
    const { classInstance, nextProps, pendingStates } = this;
    // 状态和属性变了都会导致更新, 进入更新逻辑
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, this.nextProps, this.getState());
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

/**
 *
 *
 * @param {*} classInstance 类实例
 * @param {*} nextProps     新属性
 * @param {*} nextState     薪状态
 */
function shouldUpdate(classInstance, nextProps, nextState) {
  let willUpdate = true;
  // 如果有shouldComponentUpdate, 并且shouldComponentUpdate返回false, 就不更新
  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(nextProps, nextState)
  ) {
    willUpdate = false;
  }
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate();
  }
  classInstance.state = nextState;
  if (willUpdate) {
    classInstance.forceUpdate();
  }

  // classInstance.state = nextState;
  // classInstance.forceUpdate();
}
