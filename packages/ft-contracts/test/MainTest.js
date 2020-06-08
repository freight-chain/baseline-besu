var Main = artifacts.require("./contracts/Main.sol");

contract("Main-General", function() {
  // validate Main initialization
  it("should create a new instance of Main", function() {
    return Main.deployed()
        .then(function(instance) { return instance.derived_instance(); })
        .then(function(result) {
          assert(result.valueOf(),
                 "The derived smart contract address is missing.");
        });
  });
});
