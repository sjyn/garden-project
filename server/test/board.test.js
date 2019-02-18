const assert = require('assert');
const app = require('../src/app-router');
const request = require('request');

let application;
beforeEach((done) => {
  application = new app.AppRouter();
  application.startApplication(done);
});

afterEach((done) => {
  application.stopApplication(done);
});

describe('Board Tests', () => {
  it('should be able to register with the api', (done) => {
    const getBoardsHandler = (error, result, body) => {
      assert.deepEqual(error, undefined);
      assert.equal(result.statusCode, 200);
      assert.notEqual('', body);
      const boardsObj = JSON.parse(body);
      assert.equal(boardsObj.boards.length, 1);
      assert.equal('bulbasaur', boardsObj.boards[0]);
      done();
    }

    const registerHandler = (error, result, body) => {
      assert.deepEqual(error, undefined);
      assert.equal(result.statusCode, 200);
      assert.equal(body, 'bulbasaur');
      request.get('http://localhost:8432/client/boards', getBoardsHandler);
    };

    const body = {
      body: 'bulbasaur',
      headers: {
        'Content-Type': 'text/html',
      },
    }
    request.post('http://localhost:8432/arduino/register', body, registerHandler);
  });

  it('should be able to unregister a board with the api', (done) => {
    const listBoardsHandler = (error, result, body) => {
      assert.deepEqual(error, undefined);
      assert.equal('{"boards":[]}', body);
      assert.equal(result.statusCode, 200);
      done();
    };

    const deregisterHandler = (error, result, body) => {
      assert.deepEqual(error, undefined);
      assert.equal(result.statusCode, 200);
      request.get('http://localhost:8432/client/boards', listBoardsHandler);
    };

    const registerHandler = (error, result, body) => {
      assert.deepEqual(error, undefined);
      assert.equal(result.statusCode, 200);
      assert.equal(body, 'bulbasaur');
      request.post(`http://localhost:8432/arduino/deregister/${body}`, deregisterHandler);
    };

    const body = {
      body: 'bulbasaur',
      headers: {
        'Content-Type': 'text/html',
      },
    }
    request.post('http://localhost:8432/arduino/register', body, registerHandler);
  });

  it('should be able to get logs', (done) => {
    done();
  });
});