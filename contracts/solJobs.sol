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

    mapping(address => CreatorProfile) internal creatorProfiles;
    mapping(address => ApplicantProfile) internal applicantProfiles;

    Counters.Counter private numberOfJobsCreated;
    Counters.Counter private numberOfJobApplications;

    mapping(uint => JobOffer) internal jobOffers;
    mapping(uint => JobApplication) internal jobApplications;

    mapping(string => bool) private creatorEmail;
    mapping(string => bool) private applicantEmail;

    mapping(address => bool) private creatorAddress;
    mapping(address => bool) private applicantAddress;

    modifier accountIsUnique(string calldata email) {
        require(
            creatorEmail[email] == false && creatorAddress[tx.origin] == false,
            creatorAlredyExistsMSG
        );
        require(
            applicantEmail[email] == false &&
                applicantAddress[tx.origin] == false,
            applicantAlredyExistsMSG
        );

        _;
    }

    modifier callerHasCreatorProfile() {
        require(
            creatorAddress[tx.origin] == true,
            callerHasNoCreatorProfileMSG
        );

        _;
    }

    modifier callerHasApplicantProfile() {
        require(
            applicantAddress[tx.origin] == true,
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

    // Getters and Setters

    function getNumberOfCreatorProfiles() public view returns (uint) {
        return Counters.current(numberOfCreatorProfiles);
    }

    function getNumberOfApplicantProfiles() public view returns (uint) {
        return Counters.current(numberOfApplicantProfiles);
    }

    function getNumberOfJobsCreated() public view returns (uint) {
        return Counters.current(numberOfJobsCreated);
    }

    function getNumberOfJobApplications() public view returns (uint) {
        return Counters.current(numberOfJobApplications);
    }

    function getCreatorProfile(address address_) public view returns(CreatorProfile memory){
        CreatorProfile storage creator = creatorProfiles[address_];
        return creator;
    }

    function getApplicantProfile(address address_) public view returns(ApplicantProfile memory){
        ApplicantProfile storage applicant = applicantProfiles[address_];
        return applicant;
    }

    function getJobOffer(uint id) public view returns(JobOffer memory){
        JobOffer storage jobOffer = jobOffers[id];
        return jobOffer;
    }

    function getJobApplication(uint id) public view returns(JobApplication memory){
        JobApplication storage jobApplication = jobApplications[id];
        return jobApplication;
    }
    
    // Methods

    function createCreatorProfile(
        string calldata email,
        string calldata name,
        string calldata tagline,
        string calldata description
    ) external accountIsUnique(email) {
        uint id = Counters.current(numberOfCreatorProfiles);
        CreatorProfile storage newCreator = creatorProfiles[tx.origin];

        newCreator.id = id;
        newCreator.email = email;
        newCreator.name = name;
        newCreator.tagline = tagline;
        newCreator.description = description;

        newCreator.creatorAddress = tx.origin;
        newCreator.profileType = ProfileType.Creator;
        newCreator.verified = false;

        creatorEmail[email] = true;
        creatorAddress[tx.origin] = true;

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
        ApplicantProfile storage newApplicant = applicantProfiles[tx.origin];

        newApplicant.id = id;
        newApplicant.email = email;
        newApplicant.name = name;
        newApplicant.location = location;
        newApplicant.bio = bio;

        newApplicant.applicantAddress = tx.origin;
        newApplicant.profileType = ProfileType.Applicant;

        applicantEmail[email] = true;
        applicantAddress[tx.origin] = true;

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

        CreatorProfile memory creator = creatorProfiles[tx.origin];
        offer.creator = creator;

        emit JobOfferCreated(id);

        Counters.increment(numberOfJobsCreated);
    }

    function alsterJobStatus(
        uint jobOfferId,
        JobOfferStatus jobOfferStatus
    ) external {
        require(
            jobOffers[jobOfferId].creator.creatorAddress == tx.origin ||
                manager == tx.origin,
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

        ApplicantProfile memory applicant = applicantProfiles[tx.origin];
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

        require(
            jobOffer.jobOfferStatus == JobOfferStatus.Open,
            applicationNotOpenMSG
        );
        require(
            jobOffer.numberHired < jobOffer.numberOfMaxHires,
            jobMaxedOutHiresMSG
        );
        require(
            application.status == JobApplicationStatus.Pending,
            jobIsNoLongerOpenMSG
        );

        // Change the application status to approve
        application.status = JobApplicationStatus.Approved;
        jobOffer.numberHired++;

        // Close job offer if the hiers max number is reached
        if (jobOffer.numberHired == jobOffer.numberOfMaxHires) {
            jobOffer.jobOfferStatus = JobOfferStatus.Filled;
        }
    }

    function rejectApplication(uint applicationId) external {
        JobApplication storage application = jobApplications[applicationId];

        // Chamge the application status to rejected
        application.status = JobApplicationStatus.Rejetcted;
    }
}
