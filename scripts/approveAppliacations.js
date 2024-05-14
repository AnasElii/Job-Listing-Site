const { getInitializedContract } = require("./constants");

// Approving Application
async function approveApplication(solJobsInstance, account, id) {
    await solJobsInstance.connect(account).approveApplication(id);
}

async function getJobApplication(jobContract, id){
    const jobApplication = sobContract.getJobApplication(id);
    return jobApplication;
}

async function main() {
    const { jobContract, accounts } = await getInitializedContract();

    // Interact with the smart contract
    // Approve the 1th application
    await approveApplication(jobContract, accounts[1], 0);

    console.log("==== Application ====");
    console.log("Application status 1:", (await getJobApplication(jobContract, 0)).status);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });