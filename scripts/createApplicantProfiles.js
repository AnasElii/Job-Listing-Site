const { getInitializedContract, applicantsDetails } = require("./constants");

// Applicant Profile

async function createApplicantProfile(solJobsInstance, account, email, name, location, bio) {
    await solJobsInstance.connect(account).createApplicantProfile(email, name, location, bio);
}

async function main() {
    const { jobContract, accounts } = await getInitializedContract();

    // Interact with the smart contract
    for(let i = 1; i < 5; i++){
        let applicant = applicantsDetails[(i - 1)];

        await createApplicantProfile(jobContract, accounts[i+1], applicant.email, applicant.name, applicant.location, applicant.bio);
    }


}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });