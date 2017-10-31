pragma solidity ^0.4.7;

contract Ballot {

  struct Voter {
    int weight;
    mapping(uint => bool) votedProposal;
  }

  struct Proposal {
    bytes32 name;
    int positiveVoteCount;
    int negativeVoteCount;
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

  function getProposals() public returns (Proposal[]) {
    return proposals;
  }

  function getLength() public constant returns(uint count) {
      return proposals.length;
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
      int winningVoteCount = 0;
      for( uint p =
         0; p < proposals.length; p++) {
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
