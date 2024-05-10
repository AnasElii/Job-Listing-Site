const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const CountersModule = require("./Counters");

const ContractModule = buildModule("SolJobsModule", (m) => {
    const counters = m.useModule(CountersModule);
    const solJobs = m.contract("SolJobs",[], {
        libraries: {
            Counters: counters.counters,
        },
    });
    return { solJobs };
});

module.exports = ContractModule;