const express = require("express")
const router = express.Router()
let state=[2,3,2,0]

router.post("/executeCommand", (req, res) => {
  const { term, command } = req.body
  if (term && command) {
    execute(command)
    res.json({ term, command })
  } else {
    console.log("invalid response")
  }
})

const execute = (command) => {
  console.log(state, command)
  console.log("setting,adding ,multiplying")
  const userarr = command.split(" ")
  if(userarr[0] === "SET"){
    state[parseInt(userarr[1])] = parseInt(userarr[2])
  }
  if (userarr[0] === "ADD") {
    state[userarr[1]] = state[userarr[2]] + state[userarr[3]]
  } else if (userarr[0] === "MUL") {
    state[userarr[1]] = state[userarr[2]] * state[userarr[3]]
  } else if (userarr[0] === "DIV") {
    state[userarr[1]] = state[userarr[2]] / state[userarr[3]]
  } else if (userarr[0] === "SUB") {
    state[userarr[1]] = state[userarr[2]] - state[userarr[3]]
  console.log(state)
}}

module.exports = router
