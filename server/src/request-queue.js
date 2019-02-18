const pokemonNamer = require('pokemon');

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
    return requestQueue.pop();
  }

  peekRequestForBoard(boardId) {
    const requestQueue = this.requestHolder[boardId];
    return this.requestHolder[boardId][requestQueue.length - 1];
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
