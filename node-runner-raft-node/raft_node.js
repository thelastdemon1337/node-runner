const fs = require('fs-extra');
const express = require('express');
const cors = require('cors')
const axios = require('axios');


// middleware
const app = express();
app.use(express.json())
app.use(cors)

// spin up a node
let electionTimeout = null

async function readConfig() {
  try {
    const config = await fs.readJSON('config.json');
    return config;
  } catch (error) {
    console.error(`Error reading config file: ${error}`);
    process.exit(1);
  }
}

// async function startPeer(peerId) {

// }

let raftState = {
  currentTerm: 0,
  votedFor: null,
  log: [{term: 0, command: "initial log entry"}],
  commitIndex: 0,
  lastApplied: 0,
  nextIndex: [],
  matchIndex: []
};

function getRandomTimeout() {
  return Math.floor(Math.random() * 1500) + 1500;
}

const spinUp = async (peerId) => {
  // spin up raft nodes
  const config = await readConfig();

  // Find the peer object with the given id in the config file
  const peerConfig = config.peers.find(peer => peer.id === peerId);
  
  const peer = config.peers.find(p => p.id === peerId);

  // Extract the electionTimeout value for the peer
  electionTimeout = peer ? peer.electionTimeout : null;

  // Print the electionTimeout to the console
  console.log(electionTimeout);

  if (!peerConfig) {
    console.error(`Peer ${peerId} not found in config file.`);
    process.exit(1);
  }

  // Parse the port number from the peer's URL
  const urlParts = new URL(peerConfig.url);
  const port = urlParts.port;

  // Start the Raft node
  // console.log(`Starting peer ${peerId} on port ${port}...`);

  await new Promise((resolve, reject) => {
    app.listen(port, () => {
      try {
        console.log(`Peer ${peerId} listening on port ${port}.`);
      resolve()
      } catch (error) {
        console.log(error)
        
      }
      

    });
  })
}

async function startFollower(peerId) {
  // Follower logic
  
  console.log('Starting as follower');

  if(raftState.currentTerm == 0) timeout = 5000
  else timeout = getRandomTimeout()
  console.log(timeout)

  console.log(timeout)
  setTimeout(() => {
    console.log('Timeout expired, becoming candidate');
    startCandidate(peerId, electionTimeout);
  }, timeout);
}

function startCandidate(peerId, electionTimeout) {
  console.log('Starting as candidate');

  // Vote for self
  raftState.currentTerm += 1;
  raftState.votedFor = 'self';

  // Count votes
  let votesReceived = 1; // Vote for self
  const totalNodes = 5; // Assuming there are 5 nodes in the cluster

  setTimeout(() => {
    console.log('Election Timeout expired, reverting to follower and resetting timeout!');
    startFollower(peerId);
  }, electionTimeout);

  // Loop through all other nodes and send a RequestVote message
  for (let i = 1; i <= totalNodes; i++) {
    if (i === peerId) continue; // Skip self

    const url = `http://localhost:${3000 + i}/RequestVote`;

    const requestData = {
      term: raftState.currentTerm,
      candidateId: peerId,
      lastLogIndex: raftState.log.length - 1,
      lastLogTerm: raftState.log[raftState.log.length - 1].term
    };

    // Send RequestVote message to other node
    axios.post(url, requestData)
      .then(response => {
        // Handle response from other node
        if (response.data.term > raftState.currentTerm) {
          // Other node has a higher term, become follower
          raftState.currentTerm = response.data.term;
          startFollower();
        } else if (response.data.voteGranted) {
          // Other node granted vote
          votesReceived += 1;

          if (votesReceived > totalNodes / 2) {
            // Received majority of votes, become leader
            startLeader();
          }
        } else {
          // Other node did not grant vote
          if (response.data.term === raftState.currentTerm) {
            // Other node has the same term as the candidate, check log
            const lastLogIndex = raftState.log.length - 1;
            const lastLogTerm = raftState.log[lastLogIndex].term;
            const otherLastLogIndex = response.data.lastLogIndex;
            const otherLastLogTerm = response.data.lastLogTerm;

            if (
              otherLastLogTerm > lastLogTerm ||
              (otherLastLogTerm === lastLogTerm && otherLastLogIndex >= lastLogIndex)
            ) {
              // Other node's log is more up-to-date, become follower
              startFollower();
            }
          }
        }
      })
      .catch(error => {
        console.error('Error sending RequestVote message:', error);
      });
  }
}




function startLeader() {
  console.log('Starting as leader');

  // Implement logic for sending heartbeats to other nodes
}


// REST
app.get('/', (req, res) => {
  res.send(raftState);
});

app.post('/RequestVote', (req, res) => {
  console.log(`Request Data : ${req.data}`)
  const candidateTerm = req.body.term;
  const candidateId = req.body.candidateId;
  const lastLogIndex = req.body.lastLogIndex;
  const lastLogTerm = req.body.lastLogTerm;

  // Reply false if term < currentTerm
  if (candidateTerm < raftState.currentTerm) {
    res.send({ term: raftState.currentTerm, voteGranted: false });
    return;
  }

  // If votedFor is null or candidateId, and candidate’s log is at least as up-to-date as receiver’s log, grant vote
  const lastLog = raftState.log[raftState.log.length - 1];
  const logUpToDate = (lastLogTerm > lastLog.term) ||
                      (lastLogTerm === lastLog.term && lastLogIndex <= raftState.log.length - 1);
  if ((raftState.votedFor === null || raftState.votedFor === candidateId) && logUpToDate) {
    raftState.votedFor = candidateId;
    res.send({ term: candidateTerm, voteGranted: true });
    return;
  }

  // Otherwise, deny the vote
  res.send({ term: raftState.currentTerm, voteGranted: false });
});


app.post('/append-entries', (req, res) => {
  const message = req.body;

  // Implement logic for AppendEntries message
  // ...

  res.send('OK');
});




// starts execution from here

const peerId = process.argv[2];
spinUp(peerId);
startFollower(peerId);


// node raft_node.js 1