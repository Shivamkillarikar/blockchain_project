const contractAddress = "0xc622984A1B4e83191210124410980f54d81782eB"; 
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

async function init() {
     const provider = new ethers.providers.JsonRpcProvider(
        "http://127.0.0.1:7545"
    );

    // Ganache account private key
    const privateKey = "0xac913a4c1b2be4fe1f5b847102d9e294dde48a7515f885895dbf3a98dbac7823";

    const signer = new ethers.Wallet(privateKey, provider);

    // Create contract instance
    contract = new ethers.Contract(contractAddress, abi, signer);

    document.getElementById("status").innerText =
        "✅ Connected to Blockchain (No MetaMask)";
        loadHistory();
    }

async function getFileHash(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

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

async function issueCert() {
    const id = document.getElementById("certId").value;
    const name = document.getElementById("studentName").value;
    const course = document.getElementById("courseName").value;
    const file = document.getElementById("fileInput").files[0];

    if (!id || !name || !course || !file) return alert("Please fill all fields and select a file.");

    try {
        document.getElementById("status").innerText = "⏳ Processing (Hash & IPFS)...";
        
        // 1. Generate the file hash locally
        const fileHash = await getFileHash(file);
        
        // 2. Upload to IPFS and store the returned hash in 'ipfsHash'
        const ipfsHash = await uploadToIPFS(file); 
        
        document.getElementById("status").innerText = "⏳ Confirming with MetaMask...";

        // 3. Call the contract (ipfsHash is now defined)
        const tx = await contract.issueCertificate(id, name, course, ipfsHash, fileHash);
        await tx.wait();
        
        document.getElementById("status").innerText = "✅ Issued Successfully!";
        loadHistory();
    } catch (e) {
        console.error(e);
        if (e.message.includes("already been issued")) {
            alert("Duplicate Blocked: This PDF content is already registered!");
        } else {
            alert("Error: " + e.message);
        }
        document.getElementById("status").innerText = "❌ Transaction Failed";
    }
}

async function verifyByFile() {
    const file = document.getElementById("verifyFile").files[0];
    if (!file) return alert("Select a file to verify.");
    const uploadedHash = await getFileHash(file);
    const exists = await contract.hashExists(uploadedHash);
    document.getElementById("result").innerHTML = exists ? 
        "<b style='color:#4ade80'>✅ AUTHENTIC DOCUMENT</b>" : 
        "<b style='color:#f87171'>❌ FAKE OR TAMPERED</b>";
}

async function verifyCert() {
    const id = document.getElementById("verifyId").value;
    const resDiv = document.getElementById("result");
    if (!id) return;
    try {
        const data = await contract.verify(id);
        const date = new Date(data[4] * 1000).toLocaleDateString();
        resDiv.innerHTML = `
            <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; margin-top:10px; border:1px solid #6366f1">
                <p><b>Student:</b> ${data[0]}</p>
                <p><b>Course:</b> ${data[1]}</p>
                <p><b>Date:</b> ${date}</p>
                <a href="https://gateway.pinata.cloud/ipfs/${data[2]}" target="_blank" style="color:#818cf8">View PDF</a>
            </div>`;
    } catch (e) { resDiv.innerHTML = "<p style='color:red'>ID not found.</p>"; }
}

async function loadHistory() {
    try {
        const filter = contract.filters.CertificateIssued();
        const logs = await contract.queryFilter(filter, 0, "latest");
        const list = document.getElementById("historyList");
        list.innerHTML = "";
        logs.reverse().forEach(log => {
            const { id, name, course } = log.args;
            list.innerHTML += `<div class='h-item'>🆔 ${id} | 👤 ${name} | 📚 ${course}</div>`;
        });
    } catch (e) { console.log("History failed to load"); }
}

window.onload = init;
