const express = require('express');
const bodyParser = require('body-parser');
const requestStack = require('./request-queue');
const logManager = require('./log-manager');
const utilities = require('./utilities');

class AppRouter {
  constructor() {
    this.requestStack = new requestStack.RequestStack();
    this.logManager = new logManager.LogManager();
    this.app = express();
    this.app.use(bodyParser.text());
    this.app.use(bodyParser.json());
    this.app.use(this.corsHandler.bind(this));
    this.setupRoutes();
  }

  corsHandler(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }

  setupRoutes() {
    const arduinoRouter = new express.Router();
    arduinoRouter.post('/register', this.registerBoard.bind(this));
    arduinoRouter.post('/deregister/:id', this.deregisterBoard.bind(this));
    arduinoRouter.get('/messages/:id', this.popMessage.bind(this));
    arduinoRouter.post('/logs/:id', this.appendLogsForBoard.bind(this));
    this.app.use('/arduino', arduinoRouter);

    const frontendRouter = new express.Router();
    frontendRouter.get('/boards', this.getBoards.bind(this));
    frontendRouter.post('/messages/:id', this.createMessage.bind(this));
    frontendRouter.get('/messages/:id', this.getMessagesForBoard.bind(this));
    frontendRouter.get('/logs/:id', this.getLogsForBoard.bind(this));
    this.app.use('/client', frontendRouter);
  }

  startApplication(callback) {
    this.server = this.app.listen(8432, callback);
  }

  stopApplication(callback) {
    this.server.close(callback);
  }

  getLogsForBoard(request, response) {
    const boardId = request.params['id'];
    const logs = this.logManager.getLogsForBoard(boardId);
    if (logs !== undefined) {
      response.status(200).send({logs});
    } else {
      response.status(404).send();
    }
  }

  appendLogsForBoard(request, response) {
    const boardId = request.params['id'];
    const logsToAppend = request.body;
    const appended = this.logManager.appendLogsForBoard(boardId, logsToAppend);
    if (appended) {
      response.status(200).send();
    } else {
      response.status(404).send();
    }
  }

  getMessagesForBoard(request, response) {
    const boardId = request.params['id'];
    const messages = this.requestStack.requestHolder[boardId];
    if (!!messages) {
      response.status(200).send(JSON.stringify({messages}));
    } else {
      response.status(404).send();
    }
  }

  getBoards(request, response) {
    const json = JSON.stringify({
      boards: this.requestStack.getBoards(),
    });
    response.status(200).send(json);
  }

  deregisterBoard(request, response) {
    const boardId = request.params['id'];
    const result = this.requestStack.deregisterBoard(boardId);
    if (result === true) {
      response.status(200).send(boardId);
    } else {
      response.status(404).send(boardId);
    }
  }

  // user sends the name of the pokemon for this board
  registerBoard(request, response) {
    const boardId = request.body;
    const registered = this.requestStack.registerBoard(boardId);
    this.logManager.registerBoard(boardId);
    if (registered === true) {
      response.status(200).send(request.body);
    } else {
      response.status(500).send(request.body);
    }
  }

  popMessage(request, response) {
    const boardId = request.params['id'];
    const message = this.requestStack.popRequestForBoard(boardId);
    if (!!message) {
      response.status(200).send(utilities.stripMessageDate(message));
    } else {
      response.status(204).send();
    }
  }

  createMessage(request, response) {
    const boardId = request.params['id'];
    const message = utilities.formatMessageDate(request.body.message);
    const result = this.requestStack.addMessageForBoard(boardId, message);
    if (result === true) {
      response.status(201).send(message);
    } else {
      response.status(404).send(JSON.stringify({boardId, message}));
    }
  }

}

module.exports.AppRouter = AppRouter;