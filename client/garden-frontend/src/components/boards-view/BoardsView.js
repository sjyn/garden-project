import React, {Component} from "react";
import './BoardsView.css';
import {ApiConnector} from "../../utilities/ApiConnector";
import {SingleBoardView} from "../single-board-view/SingleBoardView";
import {LogsView} from "../logs-view/LogsView";

export class BoardsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boards: [],
      showLogs: undefined,
      loggingBoard: undefined,
    };
    this.apiService = new ApiConnector();
    this.fetchBoards();

    this.fetchLogsForBoard = this.fetchLogsForBoard.bind(this);
    this.logsBackPressed = this.logsBackPressed.bind(this);
  }

  fetchLogsForBoard(boardName) {
    this.apiService.getLogsForBoard(boardName)
    .then((logs) => {
      this.setState({
        showLogs: logs,
        loggingBoard: boardName,
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  logsBackPressed() {
    this.setState({
      showLogs: undefined,
      loggingBoard: undefined,
    });
  }

  fetchBoards() {
    this.apiService.getAllBoards()
    .then((boards) => {
      this.setState({boards});
    })
    .catch((error) => {
      console.error(error);
    });
  }

  boardsView() {
    return (
      <div className="main-content">
        <h1>Active Boards</h1>
        <div className="boards-container">
          {
            this.state.boards.map((boardName) => {
              return (
                <SingleBoardView boardName={boardName} key={boardName} viewLogsPressed={this.fetchLogsForBoard}/>
              );
            })
          }
        </div>
      </div>
    )
  }

  logsView() {
    return (
      <div className="main-content">
        <LogsView logs={this.state.showLogs} backPressed={this.logsBackPressed} board={this.state.loggingBoard}/>
      </div>
    );
  }

  render() {
    if (this.state.showLogs !== undefined) {
      return this.logsView();
    } else {
      return this.boardsView();
    }
  }
}
