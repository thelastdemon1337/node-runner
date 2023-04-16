const express = require("express")
const router = express.Router()

router.post("/appendEntries", (req, res) => {
  const { term, leaderId, prevLogIndex, prevLogTerm, entries = [{ term, value }], leaderCommit } = req.body

  if (term && leaderId && Number.isInteger(prevLogIndex) && Number.isInteger(prevLogTerm) && entries && leaderCommit > 0) {
    // Set success to true or false based on some condition
    const success = true

    res.json({
      term: term,
      success: success
    })
  } else {
    res.status(400).json({ error: "Invalid request" })
  }
})

module.exports = router