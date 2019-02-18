const utilities = require('./utilities');

class LogManager {
  constructor() {
    this.logMap = {};
  }

  registerBoard(boardId) {
    this.logMap[boardId] = '';
  }

  appendLogsForBoard(boardId, newLogs) {
    if (boardId in this.logMap) {
      let logs = this.logMap[boardId] || '';
      logs += `[${utilities.getNiceDate()}]: ${newLogs}\n`;
      this.logMap[boardId] = logs;
      return true;
    }
    return false;
  }

  getLogsForBoard(boardId) {
    return this.logMap[boardId];
  }
}

module.exports.LogManager = LogManager;
