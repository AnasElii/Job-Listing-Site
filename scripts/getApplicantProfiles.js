const { getInitializedContract, applicantsDetails } = require("./constants");

// Applicant Profile
async function getApplicantProfile(solJobsInstance, address) {
    const appliacntProfile = await solJobsInstance.getApplicantProfile(address);
    return appliacntProfile;
}

async function main() {
    const { jobContract, accounts } = await getInitializedContract();

    // Interact with the smart contract
    for(let i = 2; i < 6; i++){
        console.log("Applicants", await getApplicantProfile(jobContract, accounts[i]));
    }

}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });