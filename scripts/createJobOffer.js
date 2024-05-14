const { getInitializedContract, jobDetails } = require("./constants");


async function createJobOffer(jobContract, account, title, description, compensation, numberOfMaxHires) {
    await jobContract.connect(account).createJobOffer(title, description, compensation, numberOfMaxHires);
}

async function main() {
    const { jobContract, accounts } = await getInitializedContract();

    // Interact with the smart contract
    const jobOffer = jobDetails[0];
    await createJobOffer(jobContract, accounts[1], jobOffer.title, jobOffer.description, jobOffer.compensation, 50);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });