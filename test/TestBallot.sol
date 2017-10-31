pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Ballot.sol";

contract TestBallot {
  Ballot ballot = Ballot(DeployedAddresses.Ballot());

  // Testing the hasVoted() function
  function testaddProposal() {
    bytes32 proposalName = "My Fisrt Proposal";
    ballot.addProposal(proposalName);
    var (expected, pos, neg) = (ballot.proposals(0));
    Assert.equal(proposalName, expected, "ProposalName should match");
  }

  // Testing the UpVote() function
  function testUserUpVote() {
    uint positiveVoteCount = 1;
    ballot.upVote(0);
    var (name, expected, neg) = (ballot.proposals(0));
    Assert.equal(positiveVoteCount, expected, "positiveVoteCount should equal 1");
  }

}
