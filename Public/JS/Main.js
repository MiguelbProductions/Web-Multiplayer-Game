import CreateGame from "./Game.js"
import createKeyBoardListener from "./Input.js"
import RenderCanvas from "./RenderScreen.js"

$(document).ready(function() {
    const SCREEN = $("#game-canvas")[0]
    const CONTEXT = SCREEN.getContext("2d")

    const CURRENTPLAYER_ID = "Player1"

    const GAME = CreateGame()
    const KEYBOARD_LISTENER = createKeyBoardListener(CURRENTPLAYER_ID)
    KEYBOARD_LISTENER.subscribe(GAME.MovePlayer)

    RenderCanvas(GAME, CONTEXT)

    const SOCKET = io()

    SOCKET.on("connect", () => {
        const PLAYERID = SOCKET.id
        
        console.log(`Player connected on client with id ${PLAYERID}`)
    })

    SOCKET.on("setup", (State) => {
        GAME.STATE = State
    })
})