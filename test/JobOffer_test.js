const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")

describe("Jobs Contract", function () {
    async function initialize() {
        const [owner, addr1, addr2, addr3] = await ethers.getSigners();

        const counters = await ethers.deployContract("Counters");
        const jobsFactory = await ethers.getContractFactory("SolJobs", {
            libraries: {
                Counters: counters
            }
        });
        const jContract = await jobsFactory.deploy();

        return { jContract, owner, addr1, addr2, addr3 };
    }

    describe("Create Job Offer", function () {

        it("Shold create a job offer", async function () {
            const { jContract, addr1, addr2 } = await loadFixture(initialize);

            // Create a creator profile
            const email = "email@mail.com";
            const name = "Anas El";
            const tagline = "Aninoss";
            const description = "This is a small description";

            await jContract.connect(addr1).createCreatorProfile(email, name, tagline, description);

            // Create a job offer
            const title = "Blockchain Fullstack Developer";
            const offerDescription = "This is a description for the blockchain fullstack devloper job offer";
            const compensation = 10;
            const numberOfMaxHires = 2;

            await jContract.connect(addr1).createJobOffer(title, offerDescription, compensation, numberOfMaxHires);

            const offer = await jContract.getJobOffer(0);

            console.log(offer.numberOfMaxHires);

             // Create an applicant profile
             const profileEmail = "profileEmail@mail.com";
             const location = "Kenitra";
             const bio = "This is a small description";
 
             await jContract.connect(addr2).createApplicantProfile(profileEmail, name, location, bio);
             const applicant = await jContract.getApplicantProfile(addr2.address);
 
             console.log("Applicant: ", applicant);
             // Create an Application
             const jobOfferId = offer.id;
             const coverLetter = "This is the job application cover letter";
 
             await jContract.connect(addr2).createJobApplication(jobOfferId, coverLetter);
             const application_1 = await jContract.getJobApplication(0);
            console.log("Application:", application_1.id);

            await jContract.connect(addr2).createJobApplication(jobOfferId, coverLetter);
             const application_2 = await jContract.getJobApplication(1);
            console.log("Application:", application_2.id);

            

             // aprove application
            //  await jContract.connect(addr1).approveApplication(0);
            //  application = await jContract.getJobApplication(0);
            //  console.log("Application status: ", applicant.status);

            // expect(offer.id).to.equal(0);
            // expect(offer.title).to.equal(title);
            // expect(offer.description).to.equal(offerDescription);
            // expect(offer.compensation).to.equal(compensation);
            // // expect(offer.numberOfMaxHires).to.equal(numberOfMaxHires);
            // expect(offer.jobOfferStatus).to.equal(0);

            // const creator = await jContract.getCreatorProfile(addr1.address);
            // expect(offer.creator.id).to.equal(creator.id);
            // expect(offer.creator.creatorAddress).to.equal(creator.creatorAddress);
            // expect(offer.creator.email).to.equal(creator.email);
        });

    });
});