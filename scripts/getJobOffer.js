const {getInitializedContract} = require ("./constants");

async function getJobOffer(jobContract, id) {
    const jobOffer = await jobContract.getJobOffer(id);
    return jobOffer;
}

async function main() {
    const { jobContract } = await getInitializedContract();

    // Interact with the smart contract
    // console.log("Job Offer Applications:", (await getJobOffer(jobContract, 1)).applications)
    // console.log("Job Offer number Hired:", (await getJobOffer(jobContract, 1)).numberHired)
    console.log("Job Offer number of max Hires:", (await getJobOffer(jobContract, 0)))

}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });