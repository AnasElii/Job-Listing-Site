// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./constants.sol";
import "./structers.sol";
// import "./enums.sol";
import "./Counters.sol";

contract SolJobs {
    address private manager;

    Counters.Counter private numberOfCreatorProfiles;
    Counters.Counter private numberOfApplicantProfiles;

    mapping(address => CreatorProfile) public creatorProfiles;
    mapping(address => ApplicantProfile) public applicantProfiles;

    Counters.Counter private numberOfJobsCreated;
    Counters.Counter private numberOfJobApplications;

    mapping(uint => JobOffer) public jobOffers;
    mapping(uint => JobApplication) public jobApplications;

    mapping(string => bool) public creatorEmail;
    mapping(string => bool) public applicantEmail;

    mapping(address => bool) public creatorAddress;
    mapping(address => bool) public applicantAddress;

    modifier accountIsUnique(string calldata email) {
        require(
            creatorEmail[email] == false && creatorAddress[msg.sender] == false,
            creatorAlredyExistsMSG
        );
        require(
            applicantEmail[email] == false &&
                applicantAddress[msg.sender] == false,
            applicantAlredyExistsMSG
        );

        _;
    }

    modifier callerHasCreatorProfile() {
        require(
            creatorAddress[msg.sender] == true,
            callerHasNoCreatorProfileMSG
        );

        _;
    }

    modifier callerHasApplicantProfile() {
        require(
            applicantAddress[msg.sender] == true,
            callerHasNoApplicantProfileMSG
        );

        _;
    }

    modifier jobOfferStatuCheck(uint id) {
        require(
            jobOffers[id].jobOfferStatus == JobOfferStatus.Open,
            jobAlredyClosedMSG
        );
        _;
    }

    event CreatorProfileCreated(uint indexed id);
    event ApplicantProfileCreated(uint indexed id);
    event JobOfferCreated(uint indexed id);
    event ApplicationSubmitted(uint indexed id);

    constructor() {
        manager = msg.sender;
    }

    function createCreatorProfile(
        string calldata email,
        string calldata name,
        string calldata tagline,
        string calldata description
    ) external accountIsUnique(email) {
        uint id = Counters.current(numberOfCreatorProfiles);
        CreatorProfile storage newCreator = creatorProfiles[msg.sender];

        newCreator.id = id;
        newCreator.email = email;
        newCreator.name = name;
        newCreator.tagline = tagline;
        newCreator.description = description;

        newCreator.creatorAddress = msg.sender;
        newCreator.profileType = ProfileType.Creator;
        newCreator.verified = false;

        creatorEmail[email] = true;
        creatorAddress[msg.sender] = true;

        Counters.increment(numberOfCreatorProfiles);

        emit CreatorProfileCreated(id);
    }

    function createApplicantProfile(
        string calldata email,
        string calldata name,
        string calldata location,
        string calldata bio
    ) external accountIsUnique(email) {
        uint id = Counters.current(numberOfApplicantProfiles);
        ApplicantProfile storage newApplicant = applicantProfiles[msg.sender];

        newApplicant.id = id;
        newApplicant.email = email;
        newApplicant.name = name;
        newApplicant.location = location;
        newApplicant.bio = bio;

        newApplicant.applicantAddress = msg.sender;
        newApplicant.profileType = ProfileType.Applicant;

        applicantEmail[email] = true;
        applicantAddress[msg.sender] = true;

        Counters.increment(numberOfApplicantProfiles);

        emit ApplicantProfileCreated(id);
    }

    function createJobOffer(
        string calldata title,
        string calldata description,
        uint compensation,
        uint numberOfMaxHires
    ) external callerHasCreatorProfile {
        uint id = Counters.current(numberOfJobsCreated);

        JobOffer storage offer = jobOffers[id];
        offer.id = id;
        offer.title = title;
        offer.description = description;
        offer.compensation = compensation;
        offer.numberOfMaxHires = numberOfMaxHires;
        offer.numberHired = 0;
        offer.jobOfferStatus = JobOfferStatus.Open;

        CreatorProfile memory creator = creatorProfiles[msg.sender];
        offer.creator = creator;

        emit JobOfferCreated(id);

        Counters.increment(numberOfJobsCreated);
    }

    function alsterJobStatus(
        uint jobOfferId,
        JobOfferStatus jobOfferStatus
    ) external {
        require(
            jobOffers[jobOfferId].creator.creatorAddress == msg.sender ||
                manager == msg.sender,
            "Permission Denied!"
        );
        jobOffers[jobOfferId].jobOfferStatus = jobOfferStatus;
    }

    function createJobApplication(
        uint jobOfferId,
        string calldata coverLetter
    ) external callerHasApplicantProfile jobOfferStatuCheck(jobOfferId) {
        uint id = Counters.current(numberOfJobApplications);

        JobApplication storage application = jobApplications[id];

        application.id = id;
        application.jobOfferId = jobOfferId;
        application.coverLetter = coverLetter;

        ApplicantProfile memory applicant = applicantProfiles[msg.sender];
        application.applicant = applicant;
        application.status = JobApplicationStatus.Pending;

        // Job Offer
        jobOffers[jobOfferId].applications.push(application);

        emit ApplicationSubmitted(id);
        Counters.increment(numberOfJobApplications);
    }

    function approveApplication(uint applicationId) external {

        JobApplication storage application = jobApplications[applicationId];
        JobOffer storage jobOffer = jobOffers[application.jobOfferId];
        
        require(jobOffer.jobOfferStatus == JobOfferStatus.Open, applicationNotOpenMSG);
        require(jobOffer.numberHired < jobOffer.numberOfMaxHires, jobMaxedOutHiresMSG);
        require(application.status == JobApplicationStatus.Pending, jobIsNoLongerOpenMSG);

        // Change the application status to approve
        application.status = JobApplicationStatus.Approved;
        jobOffer.numberHired++;

        // Close job offer if the hiers max number is reached
         if (
            jobOffer.numberHired ==
            jobOffer.numberOfMaxHires
        ) {
            jobOffer.jobOfferStatus = JobOfferStatus.Filled;
        }

    }

    function rejectApplication(uint jobOfferId, uint applictionId) external{
        JobOffer storage jobOffer = jobOffers[jobOfferId];   
        application[applicationId].status = JobApplicationStatus.Rejetcted;
    }

}
