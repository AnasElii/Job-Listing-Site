const { ethers } = require("hardhat");

// Creator Profile
async function createCreatorProfile(solJobsInstance, account, email, name, tagline, description){
  await solJobsInstance.connect(account).createCreatorProfile(email, name, tagline, description);
}

async function getCreatorProfile(solJobsInstance, address){
  const creatorProfile = await solJobsInstance.getCreatorProfile(address); // Replace "CREATOR_ADDRESS" with the address you want to query
  return creatorProfile;
}

// Applicant Profile

async function createApplicantProfile(solJobsInstance, account, email, name, location, bio){
  await solJobsInstance.connect(account).createApplicantProfile(email, name, location, bio);
}

async function getApplicantProfile(solJobsInstance, address){
  const appliacntProfile = await solJobsInstance.getApplicantProfile(address);
  return appliacntProfile;
}

// Job Offer
async function createJobOffer(solJobsInstance, account, title, description, compensation, numberOfMaxHires){
  await solJobsInstance.connect(account).createJobOffer(title, description, compensation, numberOfMaxHires);
}

async function getJobOffer(solJobsInstance, id){
  const jobOffer = await solJobsInstance.getJobOffer(id);
  return jobOffer;
}

// Application
async function createJobApplication(solJobsInstance, account, jobOfferId, coverLetter){
  await solJobsInstance.connect(account).createJobApplication(jobOfferId, coverLetter);
}

async function getJobApplication(solJobsInstance, id){
  const application = solJobsInstance.getJobApplication(id);
  return application;
}

// Approving Application
async function approveApplication(solJobsInstance, account, id){
  await solJobsInstance.connect(account).approveApplication(id);
}

// Rejecting Application
async function rejectpplication(solJobsInstance, account, id){
  await solJobsInstance.connect(account).rejectApplication(id);
}

async function main() {
  const counters = await ethers.getContractFactory("Counters");
  const countersInstance = await counters.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  const solJobs = await ethers.getContractFactory("SolJobs", {
    libraries:
    {
      Counters: countersInstance,
    }
  });
  const solJobsInstance = await solJobs.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

  
  // Get other accounts
  const [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
  
  // Info
  const name = "Anas El";
  const tagline = "Aninoss";
  const description = "This is a small description";

  const location = "Kenitra";
  const bio = "This is the bio for the Application profile";

  const title = "Cross platform Developer";
  const offerDescription = "This is a description for the cross platform developer offer!";
  const compensation = 10;
  const numberOfMaxHires = 3;

  const coverLetter = "This is the cover letter of the job application of the applicant profile_";

  // Interact with the smart contract

  // Create Creator Profile
  await createCreatorProfile(solJobsInstance, addr1, "creator_1@email.com", name, tagline, description);

  // Create 3 Applicant Profile
  const applicantAddrList = [addr2, addr3, addr4, addr5];
  for(let i = 0; i < 4; i++){
    await createApplicantProfile(solJobsInstance, applicantAddrList[i], ("applicant_"+ i +"@email.com"), name, location, bio);
  }

  // Create a Job offer
  await createJobOffer(solJobsInstance, addr1, title, offerDescription, compensation, numberOfMaxHires);

  // Send 4 Applications
  for(let i = 0; i < 4; i++){
    await createJobApplication(solJobsInstance, applicantAddrList[i], 1, (coverLetter + i));
  }

  // Approve the 1th application
  await approveApplication(solJobsInstance, addr1, 0);
  
  // Reject the 2th application
  await rejectpplication(solJobsInstance, addr1, 1);

  // console.log("==== Applications ====");
  console.log("Application status 1:", (await getJobApplication(solJobsInstance, 0)).status);
  console.log("Application status 2:", (await getJobApplication(solJobsInstance, 1)).status);


}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});