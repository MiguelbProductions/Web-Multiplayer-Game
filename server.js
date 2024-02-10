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
GAME.AddFruit({ Fruit_ID: "Fruit1" , Fruit_X: 4, Fruit_Y: 4})

GAME.Subscribe((command) => {
    Sockets.emit(command.type, command)
})

Sockets.on("connection", (socket) => {
    const PlayerID = socket.id
    
    console.log(`Player connected on server with id ${PlayerID}`)

    GAME.AddPlayer({ Player_ID: PlayerID})

    socket.emit("setup", GAME.STATE)

    socket.on("disconnect", () => {
        GAME.RemovePlayer({ Player_ID: PlayerID })
    })
    
    socket.on("MovePlayer", (command) => {
        GAME.MovePlayer(command);

        Sockets.emit("PlayerMoved", command);
    });
})

Server.listen(PORT, () => {
    console.log(`Pixel Rush Server started on port ${PORT}`);
})