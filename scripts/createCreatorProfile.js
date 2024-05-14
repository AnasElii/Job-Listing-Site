const { getInitializedContract, creatorDetails } = require("./constants");

// Creator Profile
async function createCreatorProfile(solJobsInstance, account, email, name, tagline, description) {
    await solJobsInstance.connect(account).createCreatorProfile(email, name, tagline, description);
}

async function main() {
    const { jobContract, accounts } = await getInitializedContract();

    // Interact with the smart contract
    await createCreatorProfile(jobContract, accounts[1], creatorDetails.email, creatorDetails.name, creatorDetails.tagline, creatorDetails.description);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });