const contractAddress = "0xc622984A1B4e83191210124410980f54d81782eB"; 
const pinataJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1YzVkMTI5MS0yYWFhLTRkNTctYjQ1Mi0wM2ZjZGYyOTAzYTciLCJlbWFpbCI6InNoaXZhbWtpbGxhcmlrYXIwMDdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijk3ZTBkMTI4MDRlODhiOTdhMmM1Iiwic2NvcGVkS2V5U2VjcmV0IjoiMTg2ZDM5ZTcyZTVkODEyYmU4MzJiM2I2ZDE3NzJiYmY5NDA5NjI5ZGVjM2Y1YjQ2MjI4Zjc1ZDEyN2M1N2E0MSIsImV4cCI6MTc5OTg5NzQ4OH0.N2bsf692ByiYui-h1sJkPIth9oKRkX9IF6NW6NMtyyU"; 

const abi = [
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": false, "internalType": "string", "name": "id", "type": "string" },
            { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
            { "indexed": false, "internalType": "string", "name": "course", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "date", "type": "uint256" }
        ],
        "name": "CertificateIssued",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "name": "certs",
        "outputs": [
            { "internalType": "string", "name": "studentName", "type": "string" },
            { "internalType": "string", "name": "course", "type": "string" },
            { "internalType": "string", "name": "ipfsHash", "type": "string" },
            { "internalType": "string", "name": "fileHash", "type": "string" },
            { "internalType": "uint256", "name": "date", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "name": "hashExists",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_id", "type": "string" },
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_course", "type": "string" },
            { "internalType": "string", "name": "_ipfs", "type": "string" },
            { "internalType": "string", "name": "_fileHash", "type": "string" }
        ],
        "name": "issueCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
        "name": "verify",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" },
            { "internalType": "string", "name": "", "type": "string" },
            { "internalType": "string", "name": "", "type": "string" },
            { "internalType": "string", "name": "", "type": "string" },
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let contract;
let totalCertsIssued = 0;
let totalVerifications = 0;

// ========== INITIALIZATION ==========
async function init() {
    try {
        updateStatus("📡 Initializing MetaMask...", false);

        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            
            // Check if user is already connected
            const accounts = await provider.listAccounts();
            if (accounts.length > 0) {
                await setupContractConnection(provider);
            } else {
                updateStatus("🦊 Click to Connect MetaMask", false);
            }

            // Listen for changes (Standard for dApps)
            window.ethereum.on('accountsChanged', () => window.location.reload());
            window.ethereum.on('chainChanged', () => window.location.reload());

        } else {
            updateStatus("❌ MetaMask Not Found", false);
            showToast('Please install MetaMask!', 'error');
        }
    } catch (error) {
        console.error("Init Error:", error);
        updateStatus("❌ Connection Failed", false);
    }
}

async function setupContractConnection(provider) {
    const signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    
    const userAddress = await signer.getAddress();
    updateStatus(`✅ Connected: ${userAddress.substring(0, 6)}...${userAddress.substring(38)}`, true);
    
    showToast('Successfully linked to MetaMask', 'success');
    await loadHistory();
    initFileUploadHandlers();
}

// Optional Connect Function for a button
async function connectWallet() {
    if (window.ethereum) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            await setupContractConnection(provider);
        } catch (error) {
            showToast('User rejected connection', 'error');
        }
    }
}

// ========== UTILITY FUNCTIONS ==========
function updateStatus(message, connected) {
    const statusEl = document.getElementById("status");
    if (statusEl) {
        statusEl.innerHTML = `<span>${message}</span>`;
        if (connected) statusEl.style.borderColor = 'var(--accent)';
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<div class="toast-message">${message}</div>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function updateStats() {
    const certEl = document.getElementById('totalCerts');
    const verEl = document.getElementById('totalVerifications');
    if (certEl) certEl.textContent = totalCertsIssued;
    if (verEl) verEl.textContent = totalVerifications;
}

// ========== FILE & IPFS HANDLING ==========
function initFileUploadHandlers() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const preview = document.getElementById('filePreview');
            if (file && preview) {
                preview.classList.add('active');
                preview.innerHTML = `<i class="fas fa-file-pdf"></i> <span>${file.name}</span>`;
            }
        });
    }
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
    if (!res.ok) throw new Error('IPFS upload failed');
    const data = await res.json();
    return data.IpfsHash;
}

// ========== MAIN FUNCTIONS ==========
async function issueCert() {
    const id = document.getElementById("certId").value.trim();
    const name = document.getElementById("studentName").value.trim();
    const course = document.getElementById("courseName").value.trim();
    const file = document.getElementById("fileInput").files[0];

    if (!id || !name || !course || !file) return showToast("All fields required", 'error');

    try {
        showToast('Processing... Check MetaMask', 'info');
        const fileHash = await getFileHash(file);
        const ipfsHash = await uploadToIPFS(file);
        
        // MetaMask will pop up here
        const tx = await contract.issueCertificate(id, name, course, ipfsHash, fileHash);
        await tx.wait();
        
        showToast(`Success! Certificate ${id} Issued`, 'success');
        loadHistory();
    } catch (error) {
        console.error(error);
        showToast('Transaction Failed', 'error');
    }
}

async function verifyCert() {
    const id = document.getElementById("verifyId").value.trim();
    const resDiv = document.getElementById("result");
    if (!id) return;
    
    try {
        const data = await contract.verify(id);
        const date = new Date(data[4] * 1000).toLocaleDateString();
        resDiv.innerHTML = `<b>✅ Authentic:</b> ${data[0]} - ${data[1]} (${date})`;
        totalVerifications++;
        updateStats();
    } catch (e) {
        resDiv.innerHTML = "<span style='color:red'>❌ ID Not Found</span>";
    }
}

async function verifyByFile() {
    const file = document.getElementById("verifyFile").files[0];
    const resDiv = document.getElementById("hashResult");
    if (!file) return;

    try {
        const uploadedHash = await getFileHash(file);
        const exists = await contract.hashExists(uploadedHash);
        resDiv.innerHTML = exists ? "✅ Match: Document Authentic" : "❌ No Match: Modified Document";
        totalVerifications++;
        updateStats();
    } catch (e) {
        showToast('Verification Error', 'error');
    }
}

async function loadHistory() {
    try {
        const filter = contract.filters.CertificateIssued();
        const logs = await contract.queryFilter(filter, 0, "latest");
        const list = document.getElementById("historyList");
        if (!list) return;
        
        totalCertsIssued = logs.length;
        updateStats();
        
        list.innerHTML = "";
        logs.reverse().forEach(log => {
            const { id, name, course } = log.args;
            const item = document.createElement('div');
            item.className = 'audit-item';
            item.innerHTML = `🆔 ${id} | 👤 ${name} | 📚 ${course}`;
            list.appendChild(item);
        });
    } catch (e) {
        console.log("Load History Error");
    }
}

window.onload = init;
