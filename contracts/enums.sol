// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

enum ProfileType{
    Creator,
    Applicant
}

enum JobApplicationStatus{
    Pending,
    Approved,
    Rejetcted
}

enum JobOfferStatus{
    Open,
    Filled,
    Closed
}