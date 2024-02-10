import CreateGame from "./Game.js"
import createKeyBoardListener from "./Input.js"
import RenderCanvas from "./RenderScreen.js"

$(document).ready(function() {
    const SCREEN = $("#game-canvas")[0]
    const CONTEXT = SCREEN.getContext("2d")
    
    const SOCKET = io()

    const GAME = CreateGame()
    const KEYBOARD_LISTENER = createKeyBoardListener(SOCKET)

    SOCKET.on("connect", () => {
        const PLAYERID = SOCKET.id
        
        console.log(`Player connected on client with id ${PLAYERID}`)

        RenderCanvas(GAME, CONTEXT, PLAYERID)
    })

    SOCKET.on("setup", (State) => {
        const PLAYERID = SOCKET.id

        GAME.SetState(State)

        KEYBOARD_LISTENER.RegisterPlayerID({ PlayerID: PLAYERID })
        KEYBOARD_LISTENER.subscribe(GAME.MovePlayer)
    })

    SOCKET.on("AddPlayer", (command) => {
        GAME.AddPlayer(command)
    })

    SOCKET.on("RemovePlayer", (command) => {
        GAME.RemovePlayer(command)
    })

    SOCKET.on("PlayerMoved", (command) => {
        if (command.Player_ID != SOCKET.id) GAME.MovePlayer(command);
    });
    
})