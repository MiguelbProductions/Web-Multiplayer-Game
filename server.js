import express from "express";
import http from "http";
import socketio from "socket.io"
import CreateGame from "./Public/JS/Game.js"

const App = express()
const Server = http.createServer(App)
const Sockets = socketio(Server)

const PORT = 3000

App.use(express.static("Public"))

const GAME = CreateGame()
GAME.AddPlayer({ Player_ID: "Player1", Player_X: 0, Player_Y: 0})
GAME.AddFruit({ FRUIT_ID: "Fruit1" , Fruit_X: 4, Fruit_Y: 4})

Sockets.on("connection", (socket) => {
    const PlayerID = socket.id
    
    console.log(`Player connected on server with id ${PlayerID}`)

    socket.emit("setup", GAME.STATE)
})

Server.listen(PORT, () => {
    console.log(`Pixel Rush Server started on port ${PORT}`);
})