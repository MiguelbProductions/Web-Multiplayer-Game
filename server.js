import express from "express";
import http from "http";
import socketio from "socket.io"
import CreateGame from "./Public/JS/Game.js"

const App = express()
const Server = http.createServer(App)
const Sockets = socketio(Server)
const GAME = CreateGame()

var InGame = false

App.use(express.static("Public"))   

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

        Sockets.emit("PlayerMoved", command)
    });

    socket.on("GenerateNewFruit", (command) => {
        GenerateFruit(command)
    })

    socket.on("StartGame", () => {
        if (!InGame) {
            InGame = true
            
            GenerateFruit()
        }
    })

    socket.on("StopGame", () => {
        if (InGame) {
            InGame = false

            GAME.STATE.Fruits = {}

            Sockets.emit("UpdateFruit", { Fruits: GAME.STATE.Fruits })
        }
    })

    socket.on("SetGlobalWallWrapping", (command) => {
        Sockets.emit("SetWallWrapping", command)
    })
})

function GenerateFruit(command = null) {
    GAME.AddFruit()

    if (command) {
        const CurrentPlayer = GAME.STATE.Players[command.Player_ID]

        CurrentPlayer.points += 1

        Sockets.emit("UpdateFruit", { Player_ID: command.Player_ID, Fruits: GAME.STATE.Fruits })
    } else {
        Sockets.emit("UpdateFruit", { Fruits: GAME.STATE.Fruits })
    }

}

const PORT = 3000
Server.listen(PORT, () => {
    console.log(`Pixel Rush Server started on port ${PORT}`);
})