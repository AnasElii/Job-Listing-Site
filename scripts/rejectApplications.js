const { getInitializedContract } = require("./constants");

// Rejecting Application
async function rejectpplication(solJobsInstance, account, id) {
    await solJobsInstance.connect(account).rejectApplication(id);
}

async function main() {
    const { jobContract, accounts } = await getInitializedContract();

    // Interact with the smart contract
    // Reject the 2th application
    await rejectpplication(jobContract, accounts[1], 1);

    console.log("==== Application ====");
    console.log("Application status 2:", (await getJobApplication(solJobsInstance, 1)).status);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });