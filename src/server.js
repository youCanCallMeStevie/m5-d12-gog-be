const express = require("express")
require("dotenv").config()
const listEndpoints = require("express-list-endpoints")

const gamesRouter = require("./services/games")

const server = express()

server.use(express.json())

server.get("/", (req, res, next) => res.send("Server is running..."))
server.use("/games", gamesRouter)

const port = process.env.PORT || 3001

console.log(listEndpoints(server))

server.listen(port, ()=> console.log("Server is runnning on port: " + port))