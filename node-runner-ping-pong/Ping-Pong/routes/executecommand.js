const express = require("express")
const router = express.Router()

router.post("/executeCommand", (req, res) => {
  const { string } = req.body
  if (string) {
    res.json({ string: string })
  } else {
    console.log("invalid response")
  }
})

module.exports = router