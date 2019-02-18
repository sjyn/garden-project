class RequestStack {
  constructor() {
    this.requestHolder = {};
  }

  addMessageForBoard(boardId, message) {
    const requestQueue = this.requestHolder[boardId];
    if (!!requestQueue) {
      requestQueue.push(message);
      return true;
    }
    return false;
  }

  popRequestForBoard(boardId) {
    const requestQueue = this.requestHolder[boardId];
    console.log('requestQueue', requestQueue)
    if (!!requestQueue) {
      return requestQueue.pop();
    }
  }

  registerBoard(boardName) {
    this.requestHolder[boardName] = [];
    return true;
  }

  deregisterBoard(boardId) {
    if (!!this.requestHolder[boardId]) {
      delete this.requestHolder[boardId];
      return true;
    }
    return false;
  }

  getBoards() {
    return Object.keys(this.requestHolder);
  }
}

module.exports.RequestStack = RequestStack;
