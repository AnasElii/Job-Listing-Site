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

    describe("Creator Operations", function () {
        it("Shold Create The Creator Profile ", async function () {
            const { jContract, addr1, addr3 } = await loadFixture(initialize);

            const email = "email@mail.com";
            const name = "Anas El";
            const tagline = "Aninoss";
            const description = "This is a small description";

            await jContract.connect(addr1).createCreatorProfile(email, name, tagline, description);

            const newCreator = await jContract.getCreatorProfile(addr1.address);
            expect(newCreator.id).to.equal(0);
            expect(newCreator.email).to.equal(email);
            expect(newCreator.name).to.equal(name);
            expect(newCreator.tagline).to.equal(tagline);
            expect(newCreator.description).to.equal(description);

            // Test Default Arguments
            expect(newCreator.creatorAddress).to.equal(addr1.address);
            expect(newCreator.profileType).to.equal(0);
            expect(newCreator.verified).to.equal(false);

        });

        it("Shold emit the event", async function () {
            const { jContract, addr1 } = await loadFixture(initialize);

            const email = "email3@mail.com";
            const name = "Anas El";
            const tagline = "Aninoss";
            const description = "This is a small description";

            await expect(jContract.connect(addr1).createCreatorProfile(email, name, tagline, description))
                .to.emit(jContract, "CreatorProfileCreated").withArgs(0);
        });

        it("Shold fail if the address try to create more than one account", async function () {
            const { jContract, addr1 } = await loadFixture(initialize);

            const email = "email@mail.com";
            const name = "Anas El";
            const tagline = "Aninoss";
            const description = "This is a small description";

            await jContract.connect(addr1).createCreatorProfile(email, name, tagline, description);
            await expect(jContract.connect(addr1).createCreatorProfile(email, name, tagline, description))
                .to.be.revertedWith("Creator email or address alredy existes!");
        });

    })

    describe("Applicant Operations", function () {

        it("Shold Create The Applicant Profile", async function () {
            const { jContract, addr2 } = await loadFixture(initialize);

            const email = "email@mail.com";
            const name = "Anas El";
            const location = "Kenitra";
            const bio = "This is a small description";

            await jContract.connect(addr2).createApplicantProfile(email, name, location, bio);

            const newApplicant = await jContract.getApplicantProfile(addr2.address);
            expect(newApplicant.id).to.equal(0);
            expect(newApplicant.email).to.equal(email);
            expect(newApplicant.name).to.equal(name);
            expect(newApplicant.location).to.equal(location);
            expect(newApplicant.bio).to.equal(bio);

            // Test Default Arguments
            expect(newApplicant.applicantAddress).to.equal(addr2.address);
            expect(newApplicant.profileType).to.equal(1);
        });

        it("Shold emit the event", async function () {
            const { jContract, addr2 } = await loadFixture(initialize);

            const email = "email@mail.com";
            const name = "Anas El";
            const location = "Kenitra";
            const bio = "This is a small description";

            await expect(jContract.connect(addr2).createApplicantProfile(email, name, location, bio))
                .to.emit(jContract, "ApplicantProfileCreated").withArgs(0);

        });

        it("Shold fail if the address or email alredy exists", async function () {
            const { jContract, addr2 } = await loadFixture(initialize);

            const email = "email@mail.com";
            const name = "Anas El";
            const location = "Kenitra";
            const bio = "This is a small description";

            await jContract.connect(addr2).createApplicantProfile(email, name, location, bio);

            await expect(jContract.connect(addr2).createApplicantProfile(email, name, location, bio))
                .to.be.revertedWith("Applicant email or address alredy existes!");
        });

    });

    describe("Create Job Offer", function () {

        it("Shold create a job offer", async function () {
            const { jContract, addr1 } = await loadFixture(initialize);

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
            expect(offer.id).to.equal(0);
            expect(offer.title).to.equal(title);
            expect(offer.description).to.equal(offerDescription);
            expect(offer.compensation).to.equal(compensation);
            // expect(offer.numberOfMaxHires).to.equal(numberOfMaxHires);
            expect(offer.jobOfferStatus).to.equal(0);

            const creator = await jContract.getCreatorProfile(addr1.address);
            expect(offer.creator.id).to.equal(creator.id);
            expect(offer.creator.creatorAddress).to.equal(creator.creatorAddress);
            expect(offer.creator.email).to.equal(creator.email);
        });

        it("Shold emit event after craeting the job offer", async function () {
            const { jContract, addr1 } = await loadFixture(initialize);

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

            await expect(jContract.connect(addr1).createJobOffer(title, offerDescription, compensation, numberOfMaxHires))
                .to.emit(jContract, "JobOfferCreated").withArgs(0);


        });

        it("Shold faild to create a job offer", async function () {
            const { jContract, addr1, addr2 } = await loadFixture(initialize);

            // Create a creator profile
            const email = "email@mail.com";
            const name = "Anas El";
            const location = "Kenitra";
            const bio = "This is a small description";

            await jContract.connect(addr2).createApplicantProfile(email, name, location, bio);

            // Create a job offer
            const title = "Blockchain Fullstack Developer";
            const offerDescription = "This is a description for the blockchain fullstack devloper job offer";
            const componsation = 10;
            const numberOfMaxHires = 2;

            await expect(jContract.connect(addr2).createJobOffer(title, offerDescription, componsation, numberOfMaxHires))
                .to.be.revertedWith("Caller deos not have a creator profile!");
        });

    });

    describe("Create Job Application", function () {

        async function createAJobeOffer(jContract, addr1) {
            // Create a job offer
            const title = "Blockchain Fullstack Developer";
            const offerDescription = "This is a description for the blockchain fullstack devloper job offer";
            const compensation = 10;
            const numberOfMaxHires = 2;

            await jContract.connect(addr1).createJobOffer(title, offerDescription, compensation, numberOfMaxHires);
            return await jContract.getJobOffer(0);
        }

        it("Shold create a job appliaction", async function () {
            const { jContract, addr1, addr2 } = await loadFixture(initialize);

            // Create a creator profile
            const email = "email@mail.com";
            const name = "Anas El";
            const tagline = "Aninoss";
            const description = "This is a small description";

            await jContract.connect(addr1).createCreatorProfile(email, name, tagline, description);
            const jobOffer = await createAJobeOffer(jContract, addr1);

            // Create an applicant profile
            const profileEmail = "profileEmail@mail.com";
            const location = "Kenitra";
            const bio = "This is a small description";

            await jContract.connect(addr2).createApplicantProfile(profileEmail, name, location, bio);
            const applicant = await jContract.getApplicantProfile(addr2.address);

            // Create an Application
            const jobOfferId = jobOffer.id;
            const coverLetter = "This is the job application cover letter";

            await jContract.connect(addr2).createJobApplication(jobOfferId, coverLetter);

            const application = await jContract.getJobApplication(0);
            expect(application.id).to.equal(0);
            expect(application.jobOfferId).to.equal(jobOfferId);
            expect(application.coverLetter).to.equal(coverLetter);

            expect(application.applicant.id).to.equal(applicant.id);
            expect(application.applicant.applicantAddress).to.equal(applicant.applicantAddress);
            expect(application.applicant.email).to.equal(applicant.email);
            expect(application.applicant.name).to.equal(applicant.name);
            expect(application.applicant.profileType).to.equal(applicant.profileType);

        });

        it("Shold emit event after craeting the job application", async function () {
            const { jContract, addr1, addr2 } = await loadFixture(initialize);

            // Create a creator profile
            const email = "email@mail.com";
            const name = "Anas El";
            const tagline = "Aninoss";
            const description = "This is a small description";

            await jContract.connect(addr1).createCreatorProfile(email, name, tagline, description);
            const jobOffer = await createAJobeOffer(jContract, addr1);

            // Create an applicant profile
            const profileEmail = "profileEmail@mail.com";
            const location = "Kenitra";
            const bio = "This is a small description";

            await jContract.connect(addr2).createApplicantProfile(profileEmail, name, location, bio);
            const applicant = await jContract.getApplicantProfile(addr2.address);

            // Create an Application
            const jobOfferId = jobOffer.id;
            const coverLetter = "This is the job application cover letter";

            await expect(jContract.connect(addr2).createJobApplication(jobOfferId, coverLetter))
                .to.emit(jContract, "ApplicationSubmitted").withArgs(0);
        });

        it("Shold faild to create a job application", async function () {
            const { jContract, addr1, addr2 } = await loadFixture(initialize);

            // Create a creator profile
            const email = "email@mail.com";
            const name = "Anas El";
            const tagline = "Aninoss";
            const description = "This is a small description";

            await jContract.connect(addr1).createCreatorProfile(email, name, tagline, description);
            const jobOffer = await createAJobeOffer(jContract, addr1);

            // Create an Application
            const jobOfferId = jobOffer.id;
            const coverLetter = "This is the job application cover letter";

            await expect(jContract.connect(addr1).createJobApplication(jobOfferId, coverLetter))
                .to.be.revertedWith("Caller deos not have an applicant profile!");
        });

        it("Shold faild to applied to a close job application", async function () {
            const { jContract, addr1, addr2 } = await loadFixture(initialize);

            // Create a creator profile
            const email = "email@mail.com";
            const name = "Anas El";
            const tagline = "Aninoss";
            const description = "This is a small description";

            await jContract.connect(addr1).createCreatorProfile(email, name, tagline, description);
            let jobOffer = await createAJobeOffer(jContract, addr1);
            await jContract.alsterJobStatus(0, 2);

            // Create an applicant profile
            const profileEmail = "profileEmail@mail.com";
            const location = "Kenitra";
            const bio = "This is a small description";

            await jContract.connect(addr2).createApplicantProfile(profileEmail, name, location, bio);

            // Create an Application
            const jobOfferId = jobOffer.id;
            const coverLetter = "This is the job application cover letter";

            await expect(jContract.connect(addr2).createJobApplication(jobOfferId, coverLetter))
                .to.be.revertedWith("Job offer is closed!");
        });

    });

    describe("Approve and Reject Application", function () {

        async function createAJobeOffer(jContract, addr1) {
            // Create a job offer
            const title = "Blockchain Fullstack Developer";
            const offerDescription = "This is a description for the blockchain fullstack devloper job offer";
            const compensation = 10;
            const numberOfMaxHires = 2;

            await jContract.connect(addr1).createJobOffer(title, offerDescription, compensation, numberOfMaxHires);
            return await jContract.getJobOffer(0);
        }

        describe("Approve Application", function () {

            it("Shold approve the appliaction", async function () {
                const { jContract, addr1, addr2, addr3 } = await loadFixture(initialize);

                // Create a creator profile
                const email = "email@mail.com";
                const name = "Anas El";
                const tagline = "Aninoss";
                const description = "This is a small description";

                await jContract.connect(addr1).createCreatorProfile(email, name, tagline, description);
                const jobOffer = await createAJobeOffer(jContract, addr1);

                // Create an applicant profile
                const profileEmail = "profileEmail@mail.com";
                const location = "Kenitra";
                const bio = "This is a small description";

                await jContract.connect(addr2).createApplicantProfile(profileEmail, name, location, bio);
                await jContract.connect(addr3).createApplicantProfile(profileEmail + "somthing", name, location, bio);

                // Create an Application
                const jobOfferId = jobOffer.id;
                const coverLetter = "This is the job application cover letter";

                await jContract.connect(addr2).createJobApplication(jobOfferId, coverLetter);
                await jContract.connect(addr3).createJobApplication(jobOfferId, coverLetter);

                // aprove application
                await jContract.connect(addr1).approveApplication(0);
                await jContract.connect(addr1).approveApplication(1);

                const application_1 = await jContract.getJobApplication(0);
                expect(application_1.status).to.equal(1);

                const application_2 = await jContract.getJobApplication(1);
                expect(application_2.status).to.equal(1);

            });

            it("Shold faild to add another application after reaching the max heir number", async function () {
                const { jContract, owner, addr1, addr2, addr3 } = await loadFixture(initialize);

                // Create a creator profile
                const email = "email@mail.com";
                const name = "Anas El";
                const tagline = "Aninoss";
                const description = "This is a small description";

                await jContract.connect(owner).createCreatorProfile(email, name, tagline, description);
                const jobOffer = await createAJobeOffer(jContract, owner);

                // Create an applicant profile
                const profileEmail = "profileEmail@mail.com";
                const location = "Kenitra";
                const bio = "This is a small description";

                await jContract.connect(addr1).createApplicantProfile(profileEmail, name, location, bio);
                await jContract.connect(addr2).createApplicantProfile(profileEmail + "somthing_1", name, location, bio);
                await jContract.connect(addr3).createApplicantProfile(profileEmail + "somthing_2", name, location, bio);

                // Create an Application
                const jobOfferId = jobOffer.id;
                const coverLetter = "This is the job application cover letter";

                await jContract.connect(addr1).createJobApplication(jobOfferId, coverLetter);
                await jContract.connect(addr2).createJobApplication(jobOfferId, coverLetter);
                await jContract.connect(addr3).createJobApplication(jobOfferId, coverLetter);

                // aprove application
                await jContract.connect(owner).approveApplication(0);
                await jContract.connect(owner).approveApplication(1);

                await expect(jContract.connect(owner).approveApplication(2))
                    .to.be.revertedWith("The application is not open!");

            });

            it("Shold faild to add another application after reaching the max heir number", async function () {
                const { jContract, owner, addr1, addr2, addr3 } = await loadFixture(initialize);

                // Create a creator profile
                const email = "email@mail.com";
                const name = "Anas El";
                const tagline = "Aninoss";
                const description = "This is a small description";

                await jContract.connect(owner).createCreatorProfile(email, name, tagline, description);
                const jobOffer = await createAJobeOffer(jContract, owner);

                // Create an applicant profile
                const profileEmail = "profileEmail@mail.com";
                const location = "Kenitra";
                const bio = "This is a small description";

                await jContract.connect(addr1).createApplicantProfile(profileEmail, name, location, bio);
                await jContract.connect(addr2).createApplicantProfile(profileEmail + "somthing_1", name, location, bio);
                await jContract.connect(addr3).createApplicantProfile(profileEmail + "somthing_2", name, location, bio);

                // Create an Application
                const jobOfferId = jobOffer.id;
                const coverLetter = "This is the job application cover letter";

                await jContract.connect(addr1).createJobApplication(jobOfferId, coverLetter);
                await jContract.connect(addr2).createJobApplication(jobOfferId, coverLetter);
                await jContract.connect(addr3).createJobApplication(jobOfferId, coverLetter);

                // aprove application
                await jContract.connect(owner).approveApplication(0);

                await expect(jContract.connect(owner).approveApplication(0))
                    .to.be.revertedWith("The job offer is no longer accepting applications!");

            });

        });

        describe("Reject Application", function () {

            it("Shold reject the appliaction", async function () {
                const { jContract, addr1, addr2, addr3 } = await loadFixture(initialize);

                // Create a creator profile
                const email = "email@mail.com";
                const name = "Anas El";
                const tagline = "Aninoss";
                const description = "This is a small description";

                await jContract.connect(addr1).createCreatorProfile(email, name, tagline, description);
                const jobOffer = await createAJobeOffer(jContract, addr1);

                // Create an applicant profile
                const profileEmail = "profileEmail@mail.com";
                const location = "Kenitra";
                const bio = "This is a small description";

                await jContract.connect(addr2).createApplicantProfile(profileEmail, name, location, bio);
                await jContract.connect(addr3).createApplicantProfile(profileEmail + "somthing", name, location, bio);

                // Create an Application
                const jobOfferId = jobOffer.id;
                const coverLetter = "This is the job application cover letter";

                await jContract.connect(addr2).createJobApplication(jobOfferId, coverLetter);
                await jContract.connect(addr3).createJobApplication(jobOfferId, coverLetter);

                // aprove application
                await jContract.connect(addr1).rejectApplication(0);
                await jContract.connect(addr1).rejectApplication(1);

                const application_1 = await jContract.getJobApplication(0);
                expect(application_1.status).to.equal(2);

                const application_2 = await jContract.getJobApplication(1);
                expect(application_2.status).to.equal(2);

            });

        });

    });

});