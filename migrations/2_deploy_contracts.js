var Hospital = artifacts.require('./Hospital.sol');
module.exports = function(deployer) {
    deployer.deploy(Hospital, {gas: 4500000});
};