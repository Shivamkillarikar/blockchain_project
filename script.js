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
let totalCertsIssued = 0;
let totalVerifications = 0;

// ========== INITIALIZATION ==========
async function init() {
    try {
        showToast('Connecting to blockchain...', 'info');
        
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
        const privateKey = "0xac913a4c1b2be4fe1f5b847102d9e294dde48a7515f885895dbf3a98dbac7823";
        const signer = new ethers.Wallet(privateKey, provider);
        contract = new ethers.Contract(contractAddress, abi, signer);

        updateStatus("✅ Connected to Ethereum Network", true);
        showToast('Successfully connected to blockchain!', 'success');
        
        await loadHistory();
        initFileUploadHandlers();
    } catch (error) {
        console.error("Initialization error:", error);
        updateStatus("❌ Connection Failed", false);
        showToast('Failed to connect to blockchain', 'error');
    }
}

// ========== UTILITY FUNCTIONS ==========
function updateStatus(message, connected) {
    const statusEl = document.getElementById("status");
    statusEl.innerHTML = `
        <div class="status-pulse"></div>
        <span>${message}</span>
    `;
    if (connected) {
        statusEl.style.borderColor = 'var(--accent)';
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function updateStats() {
    document.getElementById('totalCerts').textContent = totalCertsIssued;
    document.getElementById('totalVerifications').textContent = totalVerifications;
}

function showProgress() {
    document.getElementById('issueProgress').style.display = 'block';
}

function hideProgress() {
    document.getElementById('issueProgress').style.display = 'none';
    resetProgressSteps();
}

function activateProgressStep(stepNumber) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        if (index < stepNumber) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index === stepNumber) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

function resetProgressSteps() {
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
}

// ========== FILE HANDLING ==========
function initFileUploadHandlers() {
    const fileInput = document.getElementById('fileInput');
    const verifyFileInput = document.getElementById('verifyFile');
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => handleFileSelect(e, 'filePreview'));
    }
    
    if (verifyFileInput) {
        verifyFileInput.addEventListener('change', (e) => handleFileSelect(e, null));
    }
}

function handleFileSelect(event, previewId) {
    const file = event.target.files[0];
    if (file && previewId) {
        const preview = document.getElementById(previewId);
        preview.classList.add('active');
        preview.innerHTML = `
            <i class="fas fa-file-pdf"></i>
            <span>${file.name} (${(file.size / 1024).toFixed(2)} KB)</span>
            <i class="fas fa-check-circle"></i>
        `;
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
    
    if (!res.ok) {
        throw new Error('IPFS upload failed');
    }
    
    const data = await res.json();
    return data.IpfsHash;
}

// ========== CERTIFICATE ISSUANCE ==========
async function issueCert() {
    const id = document.getElementById("certId").value.trim();
    const name = document.getElementById("studentName").value.trim();
    const course = document.getElementById("courseName").value.trim();
    const file = document.getElementById("fileInput").files[0];

    if (!id || !name || !course || !file) {
        showToast("Please fill all fields and select a file", 'error');
        return;
    }

    try {
        showProgress();
        updateStatus("⏳ Processing certificate...", true);
        
        // Step 1: File Upload
        activateProgressStep(0);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Step 2: Generate Hash
        activateProgressStep(1);
        showToast('Generating cryptographic hash...', 'info');
        const fileHash = await getFileHash(file);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Step 3: Upload to IPFS
        activateProgressStep(2);
        showToast('Uploading to IPFS...', 'info');
        const ipfsHash = await uploadToIPFS(file);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Step 4: Blockchain Transaction
        activateProgressStep(3);
        showToast('Writing to blockchain...', 'info');
        const tx = await contract.issueCertificate(id, name, course, ipfsHash, fileHash);
        await tx.wait();
        
        // Mark all steps complete
        document.querySelectorAll('.progress-step').forEach(step => {
            step.classList.add('completed');
            step.classList.remove('active');
        });
        
        updateStatus("✅ Certificate Issued Successfully!", true);
        showToast(`Certificate ${id} issued successfully!`, 'success');
        
        // Reset form
        document.getElementById("issueForm").reset();
        document.getElementById("filePreview").classList.remove('active');
        
        setTimeout(() => {
            hideProgress();
            loadHistory();
        }, 2000);
        
    } catch (error) {
        console.error("Issue error:", error);
        hideProgress();
        
        if (error.message.includes("already been issued")) {
            showToast("Duplicate detected: This certificate already exists!", 'error');
        } else if (error.message.includes("IPFS")) {
            showToast("Failed to upload to IPFS. Please try again.", 'error');
        } else {
            showToast(`Error: ${error.message}`, 'error');
        }
        
        updateStatus("❌ Transaction Failed", false);
    }
}

// ========== VERIFICATION ==========
async function verifyCert() {
    const id = document.getElementById("verifyId").value.trim();
    const resDiv = document.getElementById("result");
    
    if (!id) {
        showToast("Please enter a certificate ID", 'error');
        return;
    }
    
    try {
        showToast('Querying blockchain...', 'info');
        const data = await contract.verify(id);
        
        if (!data[0]) {
            throw new Error("Certificate not found");
        }
        
        const date = new Date(data[4] * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        totalVerifications++;
        updateStats();
        
        resDiv.className = 'verification-result result-success';
        resDiv.innerHTML = `
            <div class="result-title">
                <i class="fas fa-shield-check"></i>
                <span>Certificate Verified</span>
            </div>
            <div class="result-details">
                <div class="result-item">
                    <strong>Student Name:</strong>
                    <span>${data[0]}</span>
                </div>
                <div class="result-item">
                    <strong>Course:</strong>
                    <span>${data[1]}</span>
                </div>
                <div class="result-item">
                    <strong>Issue Date:</strong>
                    <span>${date}</span>
                </div>
                <div class="result-item">
                    <strong>File Hash:</strong>
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;">${data[3].substring(0, 20)}...</span>
                </div>
            </div>
            <a href="https://gateway.pinata.cloud/ipfs/${data[2]}" target="_blank" class="result-link">
                <i class="fas fa-external-link-alt"></i>
                View Certificate Document
            </a>
        `;
        
        showToast('Certificate authenticated successfully!', 'success');
        
    } catch (error) {
        console.error("Verification error:", error);
        resDiv.className = 'verification-result result-error';
        resDiv.innerHTML = `
            <div class="result-title">
                <i class="fas fa-times-circle"></i>
                <span>Certificate Not Found</span>
            </div>
            <p style="color: var(--text-muted); margin-top: 0.5rem;">
                No certificate with ID "${id}" exists in the blockchain.
            </p>
        `;
        showToast('Certificate not found in blockchain', 'error');
    }
}

async function verifyByFile() {
    const file = document.getElementById("verifyFile").files[0];
    const resDiv = document.getElementById("hashResult");
    
    if (!file) {
        showToast("Please select a PDF file to verify", 'error');
        return;
    }
    
    try {
        showToast('Computing document hash...', 'info');
        const uploadedHash = await getFileHash(file);
        
        showToast('Checking blockchain registry...', 'info');
        const exists = await contract.hashExists(uploadedHash);
        
        totalVerifications++;
        updateStats();
        
        if (exists) {
            resDiv.className = 'verification-result result-success';
            resDiv.innerHTML = `
                <div class="result-title">
                    <i class="fas fa-check-circle"></i>
                    <span>Authentic Document</span>
                </div>
                <p style="color: var(--text-muted); margin-top: 0.5rem;">
                    This document exists in the blockchain registry and has not been tampered with.
                </p>
                <div class="result-item" style="margin-top: 1rem;">
                    <strong>SHA-256 Hash:</strong>
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; word-break: break-all;">
                        ${uploadedHash}
                    </span>
                </div>
            `;
            showToast('Document is authentic!', 'success');
        } else {
            resDiv.className = 'verification-result result-error';
            resDiv.innerHTML = `
                <div class="result-title">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Unverified Document</span>
                </div>
                <p style="color: var(--text-muted); margin-top: 0.5rem;">
                    This document does not exist in our blockchain registry. It may be fake or tampered.
                </p>
            `;
            showToast('Document could not be verified', 'error');
        }
        
    } catch (error) {
        console.error("File verification error:", error);
        resDiv.className = 'verification-result result-error';
        resDiv.innerHTML = `
            <div class="result-title">
                <i class="fas fa-times-circle"></i>
                <span>Verification Failed</span>
            </div>
            <p style="color: var(--text-muted); margin-top: 0.5rem;">
                An error occurred during verification. Please try again.
            </p>
        `;
        showToast('Verification error occurred', 'error');
    }
}

// ========== AUDIT TRAIL ==========
async function loadHistory() {
    try {
        const filter = contract.filters.CertificateIssued();
        const logs = await contract.queryFilter(filter, 0, "latest");
        const list = document.getElementById("historyList");
        
        if (logs.length === 0) {
            list.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-inbox"></i>
                    <p>No certificates issued yet</p>
                </div>
            `;
            return;
        }
        
        totalCertsIssued = logs.length;
        updateStats();
        
        list.innerHTML = "";
        logs.reverse().forEach((log, index) => {
            const { id, name, course, date } = log.args;
            const formattedDate = new Date(date * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const item = document.createElement('div');
            item.className = 'audit-item';
            item.style.animationDelay = `${index * 0.05}s`;
            item.innerHTML = `
                <div class="audit-header">
                    <span class="audit-id">${id}</span>
                    <span class="audit-badge">Verified</span>
                </div>
                <div class="audit-details">
                    <div class="audit-detail">
                        <i class="fas fa-user-graduate"></i>
                        <span>${name}</span>
                    </div>
                    <div class="audit-detail">
                        <i class="fas fa-book"></i>
                        <span>${course}</span>
                    </div>
                    <div class="audit-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${formattedDate}</span>
                    </div>
                </div>
            `;
            list.appendChild(item);
        });
        
        showToast(`Loaded ${logs.length} certificate records`, 'success');
        
    } catch (error) {
        console.error("History load error:", error);
        const list = document.getElementById("historyList");
        list.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load audit trail</p>
            </div>
        `;
        showToast('Failed to load history', 'error');
    }
}

function filterAudit() {
    const searchTerm = document.getElementById('searchAudit').value.toLowerCase();
    const items = document.querySelectorAll('.audit-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Initialize on page load
window.onload = init;
