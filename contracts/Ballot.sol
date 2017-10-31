pragma solidity ^0.4.7;

contract Ballot {

  struct Voter {
    uint weight;
    mapping(uint => bool) votedProposal;
  }

  struct Proposal {
    bytes32 name;
    uint positiveVoteCount;
    uint negativeVoteCount;
  }

  mapping(address => Voter) public voters;
  Proposal[] public proposals;

  function addProposal(bytes32 proposalName) public {
    proposals.push(
        Proposal({
        name: proposalName,
        positiveVoteCount: 0,
        negativeVoteCount: 0
        }));
  }

  modifier hasVoted(uint proposal) {
      Voter storage sender = voters[msg.sender];
      require(voters[msg.sender].votedProposal[proposal] != true);
      voters[msg.sender].weight = 1;
      voters[msg.sender].votedProposal[proposal] = true;
      _;
  }

  function upVote(uint proposal) public
  hasVoted(proposal) {
    proposals[proposal].positiveVoteCount += voters[msg.sender].weight;
  }

  function downVote(uint proposal) public
  hasVoted(proposal) {
    proposals[proposal].negativeVoteCount += voters[msg.sender].weight;
  }

  function winningProposal() constant public
        returns (uint winningProposalIdx) {
      uint winningVoteCount = 0;
      for( uint p = 0; p < proposals.length; p++) {
        if ((proposals[p].positiveVoteCount - proposals[p].negativeVoteCount) > winningVoteCount) {
          winningVoteCount = proposals[p].positiveVoteCount - proposals[p].negativeVoteCount;
          winningProposalIdx = p;
        }
      }
    }

    function getWinnerName() constant public
      returns (bytes32 winnerName) {
        winnerName = proposals[winningProposal()].name;
      }
}
