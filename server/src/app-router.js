const express = require('express');
const bodyParser = require('body-parser');
const requestStack = require('./request-queue');

class AppRouter {
  constructor() {
    this.requestStack = new requestStack.RequestStack();
    this.app = express();
    this.app.use(bodyParser.text({type: 'text/html'}));
    this.setupRoutes();
  }

  setupRoutes() {
    const arduinoRouter = new express.Router();
    arduinoRouter.post('/register', this.registerBoard.bind(this));
    arduinoRouter.post('/deregister/:id', this.deregisterBoard.bind(this));
    arduinoRouter.get('/messages/:id', this.popMessage.bind(this));
    this.app.use('/arduino', arduinoRouter);

    const frontendRouter = new express.Router();
    frontendRouter.get('/boards', this.getBoards.bind(this));
    frontendRouter.post('/messages/:id', this.createMessage.bind(this));
    this.app.use('/client', frontendRouter);
  }

  startApplication(callback) {
    this.server = this.app.listen(8432, callback);
  }

  stopApplication(callback) {
    this.server.close(callback);
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
    const registered = this.requestStack.registerBoard(request.body);
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
      response.status(200).send(message);
    } else {
      response.status(204).send();
    }
  }

  createMessage(request, response) {
    const boardId = request.params['id'];
    const message = request;
    const result = this.requestStack.addMessageForBoard(boardId, message);
    if (result === true) {
      response.status(201).send(message);
    } else {
      response.status(404).send(JSON.stringify({boardId, message}));
    }
  }

}

module.exports.AppRouter = AppRouter;