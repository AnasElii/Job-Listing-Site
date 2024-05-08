// SPDE-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./enums.sol";

struct CreateProfile {
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