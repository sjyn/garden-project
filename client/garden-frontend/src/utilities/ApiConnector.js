import axios from 'axios';

export const REQUEST_LOGS = 'logs';
export const REQUEST_TURN_ON = 'on';

export class ApiConnector {
  constructor() {
    this.mainEndpoint = 'http://localhost:8432/client';
  }

  getMessagesForBoard(boardName) {
    return axios.get(`${this.mainEndpoint}/messages/${boardName}`)
      .then((result) => {
        return result.data.messages;
      });
  }

  getLogsForBoard(boardName) {
    return new Promise((resolve, reject) => {
      axios.get(`${this.mainEndpoint}/logs/${boardName}`)
        .then((result) => {
          resolve(result.data.logs);
        })
        .catch(reject);
    })
  }

  postMessageToBoard(boardName, message) {
    return axios.post(`${this.mainEndpoint}/messages/${boardName}`, {message});
  }

  getAllBoards() {
    return new Promise((resolve, reject) => {
      axios.get(`${this.mainEndpoint}/boards`)
        .then((result) => {
          resolve(result.data.boards);
        })
        .catch(reject);
    });
  }
}
