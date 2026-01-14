// CONFIGURATION
const contractAddress = "0xf0ABfE8bC0FAe2a5A7763B9474122C6D9CF9D0Fd"; 
const pinataJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1YzVkMTI5MS0yYWFhLTRkNTctYjQ1Mi0wM2ZjZGYyOTAzYTciLCJlbWFpbCI6InNoaXZhbWtpbGxhcmlrYXIwMDdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijk3ZTBkMTI4MDRlODhiOTdhMmM1Iiwic2NvcGVkS2V5U2VjcmV0IjoiMTg2ZDM5ZTcyZTVkODEyYmU4MzJiM2I2ZDE3NzJiYmY5NDA5NjI5ZGVjM2Y1YjQ2MjI4Zjc1ZDEyN2M1N2E0MSIsImV4cCI6MTc5OTg5NzQ4OH0.N2bsf692ByiYui-h1sJkPIth9oKRkX9IF6NW6NMtyyU"; 
const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "course",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			}
		],
		"name": "CertificateIssued",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "certs",
		"outputs": [
			{
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "course",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "fileHash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "hashExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_course",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_ipfs",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_fileHash",
				"type": "string"
			}
		],
		"name": "issueCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			}
		],
		"name": "verify",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let contract;

// 1. Initialize Connection
async function init() {
    if (window.ethereum) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, abi, signer);
            document.getElementById("status").innerText = "✅ Connected to Blockchain";
            loadHistory();
        } catch (e) {
            document.getElementById("status").innerText = "❌ Connection Failed";
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// 2. Helper: SHA-256 Hashing
async function getFileHash(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 3. Pinata Upload
async function uploadToIPFS(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${pinataJWT}` },
        body: formData
    });
    const data = await res.json();
    return data.IpfsHash;
}

// 4. Issue Certificate
async function issueCert() {
    if (!contract) return alert("Contract not loaded!");
    
    const id = document.getElementById("certId").value;
    const name = document.getElementById("studentName").value;
    const course = document.getElementById("courseName").value;
    const file = document.getElementById("fileInput").files[0];

    if (!id || !file) return alert("Fields missing!");

    try {
        document.getElementById("status").innerText = "⏳ Hashing & Uploading...";
        const fileHash = await getFileHash(file);
        const ipfsHash = await uploadToIPFS(file);
        
        const tx = await contract.issueCertificate(id, name, course, ipfsHash, fileHash);
        await tx.wait();
        
        document.getElementById("status").innerText = "✅ Success!";
        loadHistory();
    } catch (e) {
        console.error(e);
        document.getElementById("status").innerText = "❌ Error: See Console";
    }
}

// 5. Verify by File
async function verifyByFile() {
    const file = document.getElementById("verifyFile").files[0];
    const resDiv = document.getElementById("result");
    if (!file) return;

    const uploadedHash = await getFileHash(file);
    const exists = await contract.hashExists(uploadedHash);
    
    resDiv.innerHTML = exists ? 
        "<b style='color:#4ade80'>✅ AUTHENTIC DOCUMENT</b>" : 
        "<b style='color:#f87171'>❌ FAKE/TAMPERED</b>";
}

// 6. Load History from Events
async function loadHistory() {
    const list = document.getElementById("historyList");
    list.innerHTML = "Fetching...";
    try {
        const filter = contract.filters.CertificateIssued();
        const logs = await contract.queryFilter(filter, 0, "latest");
        list.innerHTML = "";
        logs.reverse().forEach(log => {
            const { id, name, course } = log.args;
            list.innerHTML += `<div class='h-item'>🆔 ${id} | 👤 ${name} | 📚 ${course}</div>`;
        });
    } catch (e) { list.innerHTML = "No history found."; }
}


async function verifyCert() {
    const id = document.getElementById("verifyId").value;
    const resDiv = document.getElementById("result");

    if (!id) return alert("Please enter a Certificate ID to search.");

    try {
        resDiv.innerHTML = "⏳ Searching blockchain...";
        
        // Calling the 'verify' function from your Solidity contract
        const data = await contract.verify(id);

        // data[0] = Name, data[1] = Course, data[2] = IPFS Hash, data[4] = Date
        const date = new Date(data[4] * 1000).toLocaleDateString();

        resDiv.innerHTML = `
            <div style="background: rgba(99, 102, 241, 0.2); padding: 15px; border-radius: 10px; border: 1px solid var(--primary); margin-top: 10px;">
                <h4 style="margin: 0; color: #818cf8;">✅ Record Found</h4>
                <p style="margin: 5px 0;"><strong>Student:</strong> ${data[0]}</p>
                <p style="margin: 5px 0;"><strong>Course:</strong> ${data[1]}</p>
                <p style="margin: 5px 0;"><strong>Issued on:</strong> ${date}</p>
                <a href="https://gateway.pinata.cloud/ipfs/${data[2]}" target="_blank" style="color: #4ade80; text-decoration: none; font-size: 0.9em;">📂 View Original PDF</a>
            </div>
        `;
    } catch (e) {
        console.error(e);
        resDiv.innerHTML = "<p style='color: #f87171;'>❌ ID not found on the blockchain.</p>";
    }
}

window.onload = init;
