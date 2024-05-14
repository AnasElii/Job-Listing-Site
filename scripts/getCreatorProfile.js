const { getInitializedContract, creatorDetails } = require("./constants");

// Creator Profile
async function getCreatorProfile(solJobsInstance, address) {
    const creatorProfile = await solJobsInstance.getCreatorProfile(address); // Replace "CREATOR_ADDRESS" with the address you want to query
    return creatorProfile;
}


async function main() {
    const { jobContract, accounts } = await getInitializedContract();

    // Interact with the smart contract
    console.log("Creator Account:", await getCreatorProfile(jobContract, accounts[1]));
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });