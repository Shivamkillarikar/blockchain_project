const contractAddress = "0x02bc468f38C6aF3AA5F21b49da753E8E846FBa8D";
const pinataJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1YzVkMTI5MS0yYWFhLTRkNTctYjQ1Mi0wM2ZjZGYyOTAzYTciLCJlbWFpbCI6InNoaXZhbWtpbGxhcmlrYXIwMDdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijk3ZTBkMTI4MDRlODhiOTdhMmM1Iiwic2NvcGVkS2V5U2VjcmV0IjoiMTg2ZDM5ZTcyZTVkODEyYmU4MzJiM2I2ZDE3NzJiYmY5NDA5NjI5ZGVjM2Y1YjQ2MjI4Zjc1ZDEyN2M1N2E0MSIsImV4cCI6MTc5OTg5NzQ4OH0.N2bsf692ByiYui-h1sJkPIth9oKRkX9IF6NW6NMtyyU"; 
const abi = [
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
			}
		],
		"name": "issueCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
let signer;

async function init() {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
        document.getElementById("status").innerText = "✅ System Online";
    }
}

// Function to upload file to IPFS via Pinata
async function uploadToIPFS(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${pinataJWT}` },
        body: formData
    });
    const json = await res.json();
    return json.IpfsHash; // This is the CID
}

async function issueCert() {
    const id = document.getElementById("certId").value;
    const name = document.getElementById("studentName").value;
    const course = document.getElementById("courseName").value;
    const file = document.getElementById("fileInput").files[0];
    const status = document.getElementById("status");

    if (!file) return alert("Please select a PDF file");

    try {
        status.innerText = "⏳ Uploading to IPFS...";
        const ipfsHash = await uploadToIPFS(file);
        
        status.innerText = "⏳ Confirming on Blockchain...";
        const tx = await contract.issueCertificate(id, name, course, ipfsHash);
        await tx.wait();
        
        status.innerText = "✅ Success! Hash: " + ipfsHash;
    } catch (err) {
        console.error(err);
        status.innerText = "❌ Error occurred";
    }
}

async function verifyCert() {
    const id = document.getElementById("verifyId").value;
    const resultDiv = document.getElementById("result");

    try {
        const data = await contract.verify(id);
        const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${data[2]}`;
        
        resultDiv.innerHTML = `
            <div class="result-box">
                <strong>Verified Certificate Found!</strong><br>
                Student: ${data[0]}<br>
                Course: ${data[1]}<br>
                <a href="${ipfsUrl}" target="_blank">View Original Document (IPFS)</a>
            </div>`;
    } catch (err) {
        resultDiv.innerHTML = "<p style='color:red;'>Certificate not found!</p>";
    }
}

window.onload = init;