import React, { Component } from 'react'
import BallotContract from '../build/contracts/Ballot.json'
import getWeb3 from './utils/getWeb3'
import Button from 'simple-react-button';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      store: [],
      web3: null,
      value: '',
      ballot: null,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  upvote(index){
    var ballot = this.state.ballot
    var ballotInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      ballot.deployed().then((instance) => {
        ballotInstance = instance
        var result = instance.upVote(index, {from: accounts[0]})
        return result
      }).then((result) => {
        console.log(result);
        alert('Upvoted succesfully')
      })
    })
  }

  downvote(index){
    var ballot = this.state.ballot
    var ballotInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      ballot.deployed().then((instance) => {
        ballotInstance = instance
        var result = instance.downVote(index, {from: accounts[0]})
        return result
      }).then((result) => {
        console.log(result);
        alert('DownVoted succesfully')
      })
    })
  }

  winner() {
    var ballot = this.state.ballot
    var ballotInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      ballot.deployed().then((instance) => {
        ballotInstance = instance
        var result = instance.getWinnerName({from: accounts[0]})
        return result
      }).then((result) => {
        alert('result[0]')
      })
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    var ballot = this.state.ballot
    var ballotInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      ballot.deployed().then((instance) => {
        ballotInstance = instance
        var result = instance.addProposal(this.state.value, {from: accounts[0]})
        return result
      }).then((result) => {
        var length = this.state.store.length
        return ballotInstance.proposals(length)
      }).then((result) => {
        var array = this.state.store
        array.push(result[0])
        this.setState({ store: array })
        console.log('MF', this.state);
      })
    })
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      // Instantiate contract once web3 provided.
      this.instantiateContract()

    })
    .catch((e) => {
      console.log('Error finding web3.', e)
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const ballot = contract(BallotContract)
    ballot.setProvider(this.state.web3.currentProvider)
    this.setState({ballot: ballot})
  }

  hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  render() {
    const listItems = this.state.store.map((element, index) =>
      <ol>
          <Button value='Upvote' clickHandler={() => this.upvote(index)} />
          <Button value='Downvote' clickHandler={() => this.downvote(index)} />
           [{index}]: {this.hex2a(element)}
      </ol>
    );
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">The voting project</a>
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Welcome to the voting project</h1>
              <h3>Who is the winner</h3>
              <Button value='Winner Name' clickHandler={() => this.winner()} />
              <form onSubmit={this.handleSubmit}>
                <label>
                  <h2>Add a project</h2> <br/>
                  <input type="text" placeholder="Project 's name" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
              </form>
              <ul>
                {listItems}
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
