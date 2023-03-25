import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery, { contractAddress, nachosToken } from "./lottery";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      owner: "",
      currentProposal: {},
      value: "",
      accounts: [],
      tokenAmount: "",
    };
  }

  async componentDidMount() {
    try {
      const owner = await lottery.methods.owner().call();
      const proposalId = 1; // Set this to the desired proposal ID
      const currentProposal = await lottery.methods
        .getProposal(proposalId)
        .call();
      const accounts = await web3.eth.getAccounts();

      // Update the state with the fetched data
      this.setState({
        owner,
        accounts,
        currentProposal: {
          title: currentProposal[0],
          description: currentProposal[1],
          yesVotes: currentProposal[2],
          noVotes: currentProposal[3],
        },
      });
    } catch (error) {
      console.error("Error fetching data from the contract:", error);
    }
  }

  onVoteYes = async () => {
    const { accounts, tokenAmount } = this.state;
    const nachosTokenAmount = web3.utils.toWei(tokenAmount, "ether");

    await nachosToken.methods
      .approve(contractAddress, nachosTokenAmount)
      .send({ from: accounts[0] });

    await lottery.methods.vote(1, true).send({ from: accounts[0] });
  };

  onVoteNo = async () => {
    const { accounts, tokenAmount } = this.state;
    const nachosTokenAmount = web3.utils.toWei(tokenAmount, "ether");

    await nachosToken.methods
      .approve(contractAddress, nachosTokenAmount)
      .send({ from: accounts[0] });

    await lottery.methods.vote(1, false).send({ from: accounts[0] });
  };

  render() {
    const { currentProposal } = this.state;

    console.log("Running web3 " + web3.version);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            React App Loaded{" "}
          </a>
          <h2>Voting Contract</h2>
          <p>This contract is owned by {this.state.owner}</p>
          <p>Contract address: {contractAddress}</p>
          <h3>Current Proposal</h3>
          <p>Title: {currentProposal.title}</p>
          <p>Description: {currentProposal.description}</p>
          <p>Yes Votes: {currentProposal.yesVotes}</p>
          <p>No Votes: {currentProposal.noVotes}</p>
          <div className="vote-buttons">
            <input
              type="number"
              placeholder="Token amount"
              onChange={(event) =>
                this.setState({ tokenAmount: event.target.value })
              }
            />
            <button onClick={this.onVoteYes} className="yes">
              Vote Yes
            </button>
            <button onClick={this.onVoteNo}>Vote No</button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
