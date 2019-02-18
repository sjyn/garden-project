import React, {Component} from 'react';
import './LogsView.css';
import {capitalizeFirst} from "../../utilities/Utilities";

export class LogsView extends Component {
  render() {
    const {logs, backPressed, board} = this.props;
    return (
      <div>
        <h2>Viewing logs for {capitalizeFirst(board)}</h2>
        <button className="go-back-button" onClick={backPressed}>Go Back</button>
        <p className="logs-text">
          {logs || 'no logs found'}
        </p>
      </div>
    )
  }
}
