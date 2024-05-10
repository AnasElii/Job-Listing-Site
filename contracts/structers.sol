// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./enums.sol";

struct CreatorProfile {
    uint id;
    address creatorAddress;
    string email;
    string name;
    string tagline;
    string description;
    bool verified;
    ProfileType profileType;
    uint[] jobOfferIDs;
}

struct ApplicantProfile{
    uint id;
    address applicantAddress;
    string email;
    string name;
    string location;
    string bio;
    ProfileType profileType;
    uint[] applicationIDs;
}

struct JobOffer{
    uint id;
    string title;
    string description;
    uint compensation;
    uint numberOfMaxHires;
    uint numberHired;
    CreatorProfile creator;
    JobOfferStatus jobOfferStatus;
    JobApplication[] applications;
}

struct JobApplication{
    uint id;
    uint jobOfferId;
    string coverLetter;
    ApplicantProfile applicant;
    JobApplicationStatus status;
}