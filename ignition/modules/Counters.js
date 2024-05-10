const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const CountersModule = buildModule("CountersModule", (m) => {
    const counters = m.contract("Counters");
    return { counters };  // return the deployed contract
});

module.exports = CountersModule;