var Base = artifacts.require("Base");
var Main = artifacts.require("Main");

module.exports = function(deployer) {
    deployer.deploy(Base).then(function(){ return deployer.deploy(Main, 5, Base.address); });
}