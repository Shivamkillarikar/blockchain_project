const contractAddress = "0x0c1962D983309990195E982c523A654A272148CD";
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
      "type": "function",
      "constant": true
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
      "type": "function",
      "constant": true
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
      "type": "function",
      "constant": true
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
      "type": "function",
      "constant": true
    }
];

let contract;
let totalCertsIssued = 0;
let totalVerifications = 0;

// ========== INITIALIZATION ==========
async function init() {
    if (!window.ethereum) {
        showToast("MetaMask not detected. Please install MetaMask extension.", "error");
        updateStatus("❌ MetaMask Required");
        return;
    }
    
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
            await setup(provider);
        } else {
            updateStatus("🦊 Connect MetaMask");
        }
        
        // Event listeners for account/network changes
        window.ethereum.on('accountsChanged', () => {
            window.location.reload();
        });
        
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
        
    } catch (error) {
        console.error("Initialization error:", error);
        showToast("Failed to initialize application", "error");
    }
    
    // Setup file upload preview
    initFileHandlers();
}

async function connectWallet() {
    if (!window.ethereum) {
        showToast("Please install MetaMask first!", "error");
        return;
    }
    
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        await setup(provider);
        showToast("Wallet connected successfully!", "success");
    } catch (error) {
        if (error.code === 4001) {
            showToast("Connection rejected by user", "error");
        } else {
            showToast("Failed to connect wallet", "error");
        }
    }
}

async function setup(provider) {
    const signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    
    const addr = await signer.getAddress();
    updateStatus(`✅ ${addr.slice(0, 6)}...${addr.slice(-4)}`);
    
    await loadHistory();
}

function updateStatus(message) {
    const statusEl = document.getElementById("status");
    if (statusEl) {
        statusEl.innerHTML = `<i class="fas fa-wallet"></i><span>${message}</span>`;
    }
}

// ========== FILE HANDLING ==========
function initFileHandlers() {
    const fileInput = document.getElementById("fileInput");
    const verifyFile = document.getElementById("verifyFile");
    
    if (fileInput) {
        fileInput.addEventListener("change", (e) => handleFilePreview(e, "filePreview"));
    }
    
    if (verifyFile) {
        verifyFile.addEventListener("change", (e) => handleFilePreview(e, "verifyFilePreview"));
    }
}

function handleFilePreview(event, previewId) {
    const file = event.target.files[0];
    const preview = document.getElementById(previewId);
    
    if (file && preview) {
        const fileName = file.name;
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        
        preview.classList.add("active");
        preview.innerHTML = `
            <i class="fas fa-file-pdf"></i>
            <span>${fileName} (${fileSize} MB)</span>
        `;
    }
}

async function getFileHash(file) {
    const buf = await file.arrayBuffer();
    const hash = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

async function uploadToIPFS(file) {
    const fd = new FormData();
    fd.append("file", file);
    
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: { Authorization: `Bearer ${pinataJWT}` },
        body: fd
    });
    
    if (!res.ok) {
        throw new Error("IPFS upload failed");
    }
    
    const data = await res.json();
    return data.IpfsHash;
}

// ========== CERTIFICATE ISSUANCE ==========
async function issueCert() {
    if (!contract) {
        showToast("Please connect your wallet first", "error");
        return;
    }
    
    const id = document.getElementById("certId").value.trim();
    const name = document.getElementById("studentName").value.trim();
    const course = document.getElementById("courseName").value.trim();
    const file = document.getElementById("fileInput").files[0];
    
    // Validation
    if (!id || !name || !course || !file) {
        showToast("All fields are required", "error");
        return;
    }
    
    try {
        showToast("Processing... Please check MetaMask", "info");
        
        // Get file hash and upload to IPFS
        const fileHash = await getFileHash(file);
        showToast("Uploading to IPFS...", "info");
        const ipfsHash = await uploadToIPFS(file);
        
        // Issue certificate on blockchain
        showToast("Confirm transaction in MetaMask", "info");
        const tx = await contract.issueCertificate(id, name, course, ipfsHash, fileHash);
        
        showToast("Transaction submitted. Waiting for confirmation...", "info");
        const receipt = await tx.wait();
        
        // Display success result
        const resultDiv = document.getElementById("result");
        if (resultDiv) {
            resultDiv.className = "verification-result result-success";
            resultDiv.innerHTML = `
                <div class="result-title">
                    <i class="fas fa-check-circle"></i>
                    Certificate Issued Successfully
                </div>
                <div class="result-details">
                    <div class="result-item">
                        <strong>Certificate ID</strong>
                        <span>${id}</span>
                    </div>
                    <div class="result-item">
                        <strong>Student Name</strong>
                        <span>${name}</span>
                    </div>
                    <div class="result-item">
                        <strong>Course</strong>
                        <span>${course}</span>
                    </div>
                    <div class="result-item">
                        <strong>File Hash (SHA-256)</strong>
                        <span>${fileHash}</span>
                    </div>
                    <div class="result-item">
                        <strong>IPFS Hash</strong>
                        <span>${ipfsHash}</span>
                    </div>
                    <div class="result-item">
                        <strong>Transaction Hash</strong>
                        <span>${tx.hash}</span>
                    </div>
                    <div class="result-item">
                        <a href="https://gateway.pinata.cloud/ipfs/${ipfsHash}" target="_blank" class="btn btn-outline" style="margin-top:1rem;">
                            <i class="fas fa-external-link-alt"></i> View Certificate on IPFS
                        </a>
                    </div>
                </div>
            `;
        }
        
        showToast("Certificate issued successfully!", "success");
        
        // Clear form
        document.getElementById("certId").value = "";
        document.getElementById("studentName").value = "";
        document.getElementById("courseName").value = "";
        document.getElementById("fileInput").value = "";
        document.getElementById("filePreview").classList.remove("active");
        
        // Reload history
        await loadHistory();
        
    } catch (error) {
        console.error("Issue error:", error);
        
        if (error.code === 4001) {
            showToast("Transaction rejected by user", "error");
        } else if (error.message.includes("already exists")) {
            showToast("Certificate ID already exists", "error");
        } else {
            showToast("Failed to issue certificate", "error");
        }
    }
}

// ========== VERIFICATION FUNCTIONS ==========
async function verifyCert() {
    if (!contract) {
        showToast("Please connect your wallet first", "error");
        return;
    }
    
    const id = document.getElementById("verifyId").value.trim();
    const resultDiv = document.getElementById("result");
    
    if (!id) {
        showToast("Please enter a certificate ID", "error");
        return;
    }
    
    try {
        const cert = await contract.verify(id);
        const date = new Date(cert[4] * 1000).toLocaleDateString();
        
        resultDiv.className = "verification-result result-success";
        resultDiv.innerHTML = `
            <div class="result-title">
                <i class="fas fa-check-circle"></i>
                Certificate Verified - Authentic
            </div>
            <div class="result-details">
                <div class="result-item">
                    <strong>Student Name</strong>
                    <span>${cert[0]}</span>
                </div>
                <div class="result-item">
                    <strong>Course</strong>
                    <span>${cert[1]}</span>
                </div>
                <div class="result-item">
                    <strong>Issue Date</strong>
                    <span>${date}</span>
                </div>
                <div class="result-item">
                    <strong>File Hash</strong>
                    <span>${cert[3]}</span>
                </div>
                <div class="result-item">
                    <a href="https://gateway.pinata.cloud/ipfs/${cert[2]}" target="_blank" class="btn btn-outline" style="margin-top:1rem;">
                        <i class="fas fa-file-pdf"></i> View Original Certificate
                    </a>
                </div>
            </div>
        `;
        
        totalVerifications++;
        updateStats();
        showToast("Certificate verified successfully", "success");
        
    } catch (error) {
        resultDiv.className = "verification-result result-error";
        resultDiv.innerHTML = `
            <div class="result-title">
                <i class="fas fa-times-circle"></i>
                Certificate Not Found
            </div>
            <p style="margin-top:1rem; color: var(--muted);">
                No certificate with ID "${id}" exists on the blockchain.
                This may be a fake or unregistered certificate.
            </p>
        `;
        showToast("Certificate not found", "error");
    }
}

async function verifyByFile() {
    if (!contract) {
        showToast("Please connect your wallet first", "error");
        return;
    }
    
    const file = document.getElementById("verifyFile").files[0];
    const resultDiv = document.getElementById("hashResult");
    
    if (!file) {
        showToast("Please select a file to verify", "error");
        return;
    }
    
    try {
        showToast("Computing file hash...", "info");
        const hash = await getFileHash(file);
        
        showToast("Checking blockchain...", "info");
        const exists = await contract.hashExists(hash);
        
        if (exists) {
            resultDiv.className = "verification-result result-success";
            resultDiv.innerHTML = `
                <div class="result-title">
                    <i class="fas fa-check-circle"></i>
                    Document Verified - Authentic
                </div>
                <div class="result-details">
                    <div class="result-item">
                        <strong>File Hash</strong>
                        <span>${hash}</span>
                    </div>
                    <p style="margin-top:1rem; color: var(--text-secondary);">
                        This document exists on the blockchain and has not been modified.
                    </p>
                </div>
            `;
            showToast("Document is authentic", "success");
        } else {
            resultDiv.className = "verification-result result-error";
            resultDiv.innerHTML = `
                <div class="result-title">
                    <i class="fas fa-times-circle"></i>
                    Document Not Found
                </div>
                <div class="result-details">
                    <div class="result-item">
                        <strong>Computed Hash</strong>
                        <span>${hash}</span>
                    </div>
                    <p style="margin-top:1rem; color: var(--muted);">
                        This document's hash does not exist on the blockchain.
                        It may be fake, modified, or never registered.
                    </p>
                </div>
            `;
            showToast("Document not verified - may be fake", "error");
        }
        
        totalVerifications++;
        updateStats();
        
    } catch (error) {
        console.error("Verification error:", error);
        showToast("Verification failed", "error");
    }
}

async function verifyByHash() {
    if (!contract) {
        showToast("Please connect your wallet first", "error");
        return;
    }
    
    const hash = document.getElementById("verifyHashInput").value.trim();
    const resultDiv = document.getElementById("hashVerifyResult");
    
    if (!hash) {
        showToast("Please enter a hash value", "error");
        return;
    }
    
    try {
        const exists = await contract.hashExists(hash);
        
        if (exists) {
            resultDiv.className = "verification-result result-success";
            resultDiv.innerHTML = `
                <div class="result-title">
                    <i class="fas fa-check-circle"></i>
                    Hash Verified - Authentic
                </div>
                <p style="margin-top:1rem; color: var(--text-secondary);">
                    This hash exists on the blockchain. The certificate is authentic.
                </p>
            `;
            showToast("Hash verified - authentic certificate", "success");
        } else {
            resultDiv.className = "verification-result result-error";
            resultDiv.innerHTML = `
                <div class="result-title">
                    <i class="fas fa-times-circle"></i>
                    Hash Not Found
                </div>
                <p style="margin-top:1rem; color: var(--muted);">
                    This hash does not exist on the blockchain.
                    The document may be fake or unregistered.
                </p>
            `;
            showToast("Hash not found - may be fake", "error");
        }
        
        totalVerifications++;
        updateStats();
        
    } catch (error) {
        console.error("Hash verification error:", error);
        showToast("Verification failed", "error");
    }
}

// ========== AUDIT TRAIL ==========
async function loadHistory() {
    if (!contract) return;
    
    try {
        const filter = contract.filters.CertificateIssued();
        const logs = await contract.queryFilter(filter, 0, "latest");
        
        totalCertsIssued = logs.length;
        updateStats();
        
        const historyList = document.getElementById("historyList");
        if (!historyList) return;
        
        if (logs.length === 0) {
            historyList.innerHTML = `
                <div style="text-align:center; padding:3rem; color:var(--muted);">
                    <i class="fas fa-inbox" style="font-size:3rem; margin-bottom:1rem; display:block;"></i>
                    <p>No certificates issued yet</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = "";
        
        // Display in reverse chronological order
        for (const log of logs.reverse()) {
            const { id, name, course } = log.args;
            const txHash = log.transactionHash;
            
            try {
                const cert = await contract.verify(id);
                const date = new Date(cert[4] * 1000).toLocaleDateString();
                
                const auditItem = document.createElement("div");
                auditItem.className = "audit";
                auditItem.innerHTML = `
                    <div style="margin-bottom:0.5rem;">
                        <b>Certificate ID:</b> ${id}
                    </div>
                    <div style="margin-bottom:0.5rem;">
                        <b>Student:</b> ${name}
                    </div>
                    <div style="margin-bottom:0.5rem;">
                        <b>Course:</b> ${course}
                    </div>
                    <div style="margin-bottom:0.5rem;">
                        <b>Issue Date:</b> ${date}
                    </div>
                    <div style="margin-bottom:0.5rem;">
                        <b>Transaction:</b> <span style="font-family:monospace; font-size:0.75rem; word-break:break-all;">${txHash}</span>
                    </div>
                    <div style="margin-bottom:0.5rem;">
                        <b>File Hash:</b> <span style="font-family:monospace; font-size:0.75rem; word-break:break-all;">${cert[3]}</span>
                    </div>
                    <a href="https://gateway.pinata.cloud/ipfs/${cert[2]}" target="_blank">
                        <i class="fas fa-external-link-alt"></i> View Certificate on IPFS
                    </a>
                `;
                
                historyList.appendChild(auditItem);
            } catch (err) {
                console.error("Error loading certificate details:", err);
            }
        }
        
    } catch (error) {
        console.error("Load history error:", error);
        showToast("Failed to load certificate history", "error");
    }
}

// ========== STATS UPDATE ==========
function updateStats() {
    const certEl = document.getElementById("totalCerts");
    const verEl = document.getElementById("totalVerifications");
    
    if (certEl) {
        certEl.textContent = totalCertsIssued;
    }
    
    if (verEl) {
        verEl.textContent = totalVerifications;
    }
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    const icon = type === "success" ? "check-circle" : 
                 type === "error" ? "exclamation-circle" : 
                 "info-circle";
    
    toast.innerHTML = `
        <i class="fas fa-${icon}" style="margin-right:0.5rem;"></i>
        ${message}
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = "slideInRight 0.3s ease reverse";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ========== INITIALIZE ON LOAD ==========
window.onload = init;
