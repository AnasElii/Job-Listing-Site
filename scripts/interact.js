const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    // Replace <deployed SolJobs address> with the actual address of your deployed SolJobs contract
    const solJobsAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const solJobs = await ethers.getContractAt("SolJobs", solJobsAddress);
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();  
    // Example interaction
    // const owner = await solJobs.owner();
    // console.log("Owner:", owner);

    const email = "email@mail.com";
    const name = "Anas El";
    const tagline = "Aninoss";
    const description = "This is a small description";

    const location = "Kenitra";
    const bio = "This is a small description";

    // Create Creator
    await solJobs.connect(addr1).createCreatorProfile(email, name, tagline, description);

    const creatorAddress = await solJobs.creatorAddress(addr1.address);
    const creatorAddress3 = await solJobs.creatorAddress(addr3.address);
    console.log(creatorAddress);
    console.log(creatorAddress3);
}
  
  main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
  });
  