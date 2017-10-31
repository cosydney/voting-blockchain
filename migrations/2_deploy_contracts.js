// var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Ballot = artifacts.require("./Ballot.sol");

module.exports = function(deployer) {
  // deployer.deploy(SimpleStorage);
  deployer.deploy(Ballot);
};
