import React, {Component} from 'react';
import './SingleBoardView.css';
import {capitalizeFirst} from "../../utilities/Utilities";
import {ApiConnector, REQUEST_LOGS, REQUEST_TURN_ON} from "../../utilities/ApiConnector";

export class SingleBoardView extends Component {
  constructor(props) {
    super(props);
    this.boardName = props.boardName;
    this.apiService = new ApiConnector();
    this.state = {
      messages: [],
      loading: false,
    };

    this.fetchMessagesForBoard = this.fetchMessagesForBoard.bind(this);
    this.fetchMessagesForBoard();

    this.sendTurnOnRequest = this.sendTurnOnRequest.bind(this);
    this.sendLogsRequest = this.sendLogsRequest.bind(this);
    this.handleViewLogsPressed = this.handleViewLogsPressed.bind(this);
  }

  handleViewLogsPressed() {
    const {viewLogsPressed} = this.props;
    viewLogsPressed(this.boardName);
  }

  getPendingMessages() {
    if (!!this.state.messages && this.state.messages.length > 0) {
      return (
        <div className="pending-messages">
          <p>Pending Messages:</p>
          {
            this.state.messages.map((message, index) => {
              return <p key={index}>{message}</p>;
            })
          }
        </div>
      );
    } else {
      // noinspection CheckTagEmptyBody
      return <div className="pending-messages">No Pending Messages</div>
    }
  }

  render() {
    return (
      <div className="garden-container">
        <h2>{capitalizeFirst(this.boardName)}</h2>
        <img alt={this.boardName} src={`https://img.pokemondb.net/artwork/${this.boardName}.jpg`}/>
        {this.getPendingMessages()}
        <button
          className="request-button"
          onClick={this.sendTurnOnRequest} disabled={this.state.loading}>
          Send Turn On Request
        </button>
        <button
          className="request-button"
          onClick={this.sendLogsRequest}>
          Send Logs Request
        </button>
        <button
          className="request-button"
          onClick={this.handleViewLogsPressed}>
          View Logs
        </button>
        <button
          className="refresh-button"
          onClick={this.fetchMessagesForBoard} disabled={this.state.loading}>
          Refresh
        </button>
      </div>
    );
  }

  fetchMessagesForBoard() {
    this.apiService.getMessagesForBoard(this.boardName)
      .then((messages) => {
        this.setState({
          messages: messages || [],
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  sendTurnOnRequest() {
    this.sendMessageToBoard(REQUEST_TURN_ON)
      .then(() => this.fetchMessagesForBoard());
  }

  sendLogsRequest() {
    this.sendMessageToBoard(REQUEST_LOGS)
      .then(() => this.fetchMessagesForBoard());
  }

  sendMessageToBoard(message) {
    return this.apiService.postMessageToBoard(this.boardName, message);
  }
}
