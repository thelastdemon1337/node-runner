const express = require("express")
const router = express.Router()

router.post("/requestVote", (req, res) => {
  const { term, candidateId, lastLogTerm, lastLogIndex } = req.body

  if (term && candidateId && Number.isInteger(lastLogTerm) && Number.isInteger(lastLogIndex) && lastLogIndex > 0) {
    // Set voteGranted to true or false based on some condition
    const voteGranted = true

    res.json({
      term: term,
      voteGranted: voteGranted
    })
  } else {
    res.status(400).json({ error: "Invalid request" })
  }
})

module.exports = router
