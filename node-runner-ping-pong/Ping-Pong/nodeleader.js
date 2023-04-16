const express = require("express")
const app = express()
const requestvote = require("./routes/requestvote.js")
const appendentries = require("./routes/appendEntries.js")
const executecommand = require("./routes/executecommand.js")
app.use(express.json())

app.use("/", requestvote)
app.use("/", appendentries)
app.use("/", executecommand)

app.listen(2000, () => {
  console.log("listening on port 2000")
})
