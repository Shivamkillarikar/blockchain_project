1. Install Required Software

Install Node.js (LTS)

Download and install:
https://nodejs.org

Verify installation:

node -v
npm -v


---

Install Ganache (Local Ethereum Blockchain)

Download Ganache Desktop:
https://trufflesuite.com/ganache/

Install and open Ganache.


---

Install MetaMask Wallet

Install MetaMask browser extension:
https://metamask.io/

Create a wallet (for testing purposes).


---

Install Truffle

Install globally:

npm install -g truffle

Verify:

truffle version


---

2. Create Project and Initialize Truffle

mkdir blockchain_project
cd blockchain_project

truffle init


---

3. Add Smart Contract

Place the smart contract file inside:

contracts/CertificateAuth.sol


---

4. Add Deployment Script

Create file:

migrations/2_deploy_contracts.js

Add:

const CertificateAuth = artifacts.require("CertificateAuth");

module.exports = function (deployer) {
  deployer.deploy(CertificateAuth);
};


---

5. Start Ganache

1. Open Ganache Desktop


2. Create New Workspace


3. Use default settings:

Host: 127.0.0.1

Port: 7545



4. Start the workspace




---

6. Configure Truffle Network

Open truffle-config.js and ensure:

development: {
  host: "127.0.0.1",
  port: 7545,
  network_id: "*"
}


---

7. Compile and Deploy Smart Contract

Compile:

truffle compile

Deploy:

truffle migrate

After deployment:

Contract address will appear in terminal

ABI will be generated in:


build/contracts/CertificateAuth.json


---

8. Connect MetaMask to Ganache

Add network in MetaMask:

Network Name: Ganache
RPC URL: http://127.0.0.1:7545
Chain ID: 1337 (or 5777)
Currency Symbol: ETH


---

9. Import Ganache Account into MetaMask

1. In Ganache click key icon of any account


2. Copy private key


3. MetaMask → Import Account


4. Paste private key



MetaMask will now show test ETH.


---

10. Setup Frontend

Create a frontend folder and place:

index.html
script.js
styles.css

Inside script.js, update:

const contractAddress = "PASTE_DEPLOYED_CONTRACT_ADDRESS";

Copy ABI from:

build/contracts/CertificateAuth.json

and paste inside script.js.


---

11. Run the Frontend

Using VS Code Live Server:

Open index.html

Right click → Open with Live Server


OR run:

npx serve

Open the shown URL in browser.


---

12. Connect Wallet

1. Click Connect Wallet in the UI


2. Approve MetaMask connection


3. Ensure network = Ganache




---

13. Issue and Verify Certificates

Issue certificate → transaction stored on blockchain

Verify certificate → fetched directly from blockchain

All transactions visible in Ganache



---

14. Running After Restart

After restarting your laptop:

1. Start Ganache workspace


2. Open the frontend


3. Connect MetaMask



No need to recompile or redeploy unless Ganache workspace is reset.
