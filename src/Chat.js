import React, { Component } from "react";
// import { HubConnectionBuilder } from '@aspnet/signalr';
import * as signalR from "@aspnet/signalr";
import Cookies from 'universal-cookie';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      targetId: "",
      hubConnection: null,
      clientId: "",
      messages: [],
      key: 0,
      badgeCount: 0,
    };
  }

  componentDidMount = async () => {
    const cookies = new Cookies();

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/chat")
      .build();

    this.setState({ hubConnection }, () => {
      this.state.hubConnection
        .start()
        .then(() => console.log("Connection started!"))
        .catch((err) =>
          console.log("Error while establishing connection :(", err)
        );

      this.state.hubConnection.on("ReceivedConnectionId", (clientId) => {
        this.setState({ clientId });
      });
      this.state.hubConnection.on("RecieveMessageBroadcast", (payload) => {
        console.log("window process", this.state.badgeCount);

        [payload].map((load) => {
          console.log("load", JSON.parse(load));
          this.setState({ ...this.state, messages: JSON.parse(load) });
        });
      });
      this.state.hubConnection.on("RecieveMessageSingle", (payload) => {
        console.log("window process", this.state.badgeCount);

        console.log("window ipcRenderer", window.ipcRenderer);
        if (window && window.ipcRenderer) {

            console.log('single');
            cookies.set("badgeCount", this.state.badgeCount)
            window.ipcRenderer.sendSync("update-badge", this.state.badgeCount);
        }

        [payload].map((load) => {
          console.log("load", JSON.parse(load));
          this.setState({ ...this.state, messages: JSON.parse(load) });
        });
      });
    });
  };

  componentWillUnmount = async () => {
    this.state.hubConnection
      .stop()
      .then(() => console.log("Connection Stopped"));
  };
  handleSendMessage = async (e) => {
    e.preventDefault();
    const { clientId, message, targetId } = this.state;
    const sendMessage = JSON.stringify({
      From: clientId,
      To: targetId,
      Message: message,
    });
    this.setState({
      key: this.state.key + 1,
      badgeCount: this.state.badgeCount + 1,
    });
    await this.state.hubConnection.invoke("SendMessageAsync", sendMessage);
  };
  handleOnchange = async (e) => {
    this.setState({ message: e.target.value });
  };
  handleOnchangeTarget = async (e) => {
    this.setState({ targetId: e.target.value });
  };
  render() {
    return (
      <>
        <form>
          <span className="badge badge-secondary mb-3">
            My ID: {this.state.clientId}
          </span>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <input
              type="text"
              className="form-control"
              placeholder="Type message..."
              id="message"
              onChange={this.handleOnchange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="targetId">ClientId</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter TargetId"
              id="targetId"
              onChange={this.handleOnchangeTarget}
            />
          </div>
          <button className="btn btn-primary" onClick={this.handleSendMessage}>
            Submit
          </button>
          <div className="mt-5">
            <h1>Communication Logs</h1>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {[this.state.messages].map((message) => {
                  return (
                    <tr key={this.state.key}>
                      <td>{message.From}</td>
                      <td>{message.To}</td>
                      <td>{message.Message}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </form>
      </>
    );
  }
}

export default Chat;
