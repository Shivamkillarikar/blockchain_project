// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateAuth {
    struct Certificate {
        string studentName;
        string course;
        string ipfsHash; // New field for the PDF link
        uint256 date;
    }

    mapping(string => Certificate) public certs;
    address public admin;

    constructor() { admin = msg.sender; }

    function issueCertificate(string memory _id, string memory _name, string memory _course, string memory _ipfs) public {
        require(msg.sender == admin, "Only Admin");
        certs[_id] = Certificate(_name, _course, _ipfs, block.timestamp);
    }

    function verify(string memory _id) public view returns (string memory, string memory, string memory, uint256) {
        Certificate memory temp = certs[_id];
        require(bytes(temp.studentName).length > 0, "Not found");
        return (temp.studentName, temp.course, temp.ipfsHash, temp.date);
    }
}