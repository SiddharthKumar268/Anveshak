// services/blockchainService.js
const { ethers } = require("ethers");

const rpc = process.env.BLOCKCHAIN_RPC || "";
const privateKey = process.env.PRIVATE_KEY || "";
const contractAddress = process.env.CONTRACT_ADDRESS || "";

const contractABI = [
  "function recordAccess(string logInfo) public",
  "function getEvents() public view returns (tuple(address user,string logInfo,uint256 timestamp)[])"
];

let provider = null;
let wallet = null;
let contract = null;

if (rpc && privateKey && contractAddress) {
  try {
    provider = new ethers.JsonRpcProvider(rpc);
    wallet = new ethers.Wallet(privateKey, provider);
    contract = new ethers.Contract(contractAddress, contractABI, wallet);
  } catch (err) {
    console.warn("⚠️  Blockchain initialization warning:", err.message);
    provider = null;
    wallet = null;
    contract = null;
  }
} else {
  console.warn("⚠️  Blockchain env vars not fully set. Blockchain features disabled.");
}

async function logToBlockchain(logInfo) {
  if (!contract) {
    // configured; do nothing but return null so callers can continue.
    console.warn("Blockchain configured:logToBlockchain.");
    return null;
  }
  try {
    const tx = await contract.recordAccess(logInfo);
    // Wait for confirmation (demo-friendly)
    await tx.wait();
    return tx.hash || null;
  } catch (err) {
    console.error("Blockchain write error:", err.message || err);
    throw err;
  }
}

async function getBlockchainEvents() {
  if (!contract) {
    return [];
  }
  try {
    const events = await contract.getEvents();
    return events;
  } catch (err) {
    console.error("Blockchain read error:", err.message || err);
    throw err;
  }
}

module.exports = { logToBlockchain, getBlockchainEvents };
