// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateAuth {
    struct Certificate {
        string studentName;
        string course;
        string ipfsHash; 
        string fileHash; 
        uint256 date;
    }

    mapping(string => Certificate) public certs;
    mapping(string => bool) public hashExists; 
    address public admin;

    // Event used to pull History into the frontend
    event CertificateIssued(string id, string name, string course, uint256 date);

    constructor() { admin = msg.sender; }

    function issueCertificate(
        string memory _id, 
        string memory _name, 
        string memory _course, 
        string memory _ipfs,
        string memory _fileHash
    ) public {
        require(msg.sender == admin, "Only Admin");
        require(bytes(certs[_id].studentName).length == 0, "ID already exists");
        
        certs[_id] = Certificate(_name, _course, _ipfs, _fileHash, block.timestamp);
        hashExists[_fileHash] = true;
        
        emit CertificateIssued(_id, _name, _course, block.timestamp);
    }

    function verify(string memory _id) public view returns (string memory, string memory, string memory, string memory, uint256) {
        Certificate memory temp = certs[_id];
        require(bytes(temp.studentName).length > 0, "Record not found");
        return (temp.studentName, temp.course, temp.ipfsHash, temp.fileHash, temp.date);
    }
}
