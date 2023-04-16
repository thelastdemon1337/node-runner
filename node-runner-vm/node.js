const express = require("express")
const app = express()

const executecommand = require("./executeCommand.js")
app.use(express.json())


app.use("/", executecommand)

app.listen(2000, () => {
  console.log("listening on port 2000")
})
