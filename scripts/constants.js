const { ethers } = require("hardhat");

async function getInitializedContract() {
    const counters = await ethers.getContractFactory("Counters");
    const countersInstance = await counters.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    const solJobs = await ethers.getContractFactory("SolJobs", {
        libraries:
        {
            Counters: countersInstance,
        }
    });
    const jobContract = await solJobs.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

    // const [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    const accounts = await ethers.getSigners();
    return { jobContract, accounts };
}

const creatorDetails = {
    email: "creator@email.com",
    name: "Anas El",
    tagline: "Aninoss",
    description: "This is a small description",
}

const applicantsDetails = [
    {
        email: "applicant_1@email.com",
        name: "Anas El",
        location: "Kenitra",
        bio: "This is the bio for the Application profile",
    },
    {
        email: "applicant_2@email.com",
        name: "Anas El",
        location: "Kenitra",
        bio: "This is the bio for the Application profile",
    },
    {
        email: "applicant_3@email.com",
        name: "Anas El",
        location: "Kenitra",
        bio: "This is the bio for the Application profile",
    },
    {
        email: "applicant_4@email.com",
        name: "Anas El",
        location: "Kenitra",
        bio: "This is the bio for the Application profile",
    },
]

const jobDetails = [
    {
        title: "Blockchain Fullstack Developer",
        description: "This is a description for the Blockchain fullstack developer offer!",
        compensation: 10,
        numberOfMaxHires: 3,
    },
    {
        title: "cross platform Developer",
        description: "This is a description for the cross platform developer offer!",
        compensation: 10,
        numberOfMaxHires: 3,
    }
]

const applicationDetails = {
    coverLetter : "This is the cover letter of the job application of the applicant profile",
}

module.exports = { getInitializedContract, creatorDetails, applicantsDetails, jobDetails, applicationDetails }