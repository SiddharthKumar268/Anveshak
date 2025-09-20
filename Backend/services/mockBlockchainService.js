const crypto = require("crypto");

function makeTxHash(){return "0x"+crypto.randomBytes(32).toString("hex");}
function makeAddress(){return "0x"+crypto.randomBytes(20).toString("hex");}
function makeTimestamp(){return new Date(Date.now()-Math.floor(Math.random()*3600000));}

const descriptions=[
"🚨 Unauthorized login attempt detected. Cybersecurity dashboard logged the event with high severity for operator review.",
"🔴 Multiple failed root login attempts captured. Anomaly detection triggered a critical alert to maintain nuclear facility security.",
"⚠️ Suspicious activity: unusual access pattern recorded. Blockchain ensures immutable audit trail for accountability.",
"🟢 Routine system check completed. Event recorded in blockchain to demonstrate tamper-proof logging for audits.",
"🔥 Potential insider threat detected. Dashboard updated and log preserved on blockchain for forensic purposes.",
"💡 AI anomaly detection flagged irregular log pattern. Immutable record created for transparency and demo purposes.",
"🚦 Security status updated: warning threshold reached. Blockchain entry ensures real-time demo is credible.",
"📊 Activity summary: multiple operator actions logged. Fake blockchain confirms immutable tracking.",
"⚡ Attack simulation triggered. Blockchain entry demonstrates real-time audit trail for judges and observers.",
"🔍 Detailed log captured with metadata: IP, user, and severity. Blockchain ensures permanent and visible record."
];

function randomDescription(){return descriptions[Math.floor(Math.random()*descriptions.length)];}

function getBlockchainEvents({count=10}={}){const events=[];for(let i=1;i<=count;i++){events.push({from:makeAddress(),logInfo:`ADD:mockid${i}:user${i}:warning`,description:randomDescription(),timestamp:makeTimestamp(),txHash:makeTxHash(),blockNumber:i,confirmations:Math.floor(Math.random()*12)})}return events;}

async function logToBlockchain(logInfo){return makeTxHash();}

module.exports={logToBlockchain,getBlockchainEvents};
