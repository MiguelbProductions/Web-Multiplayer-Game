import CreateGame from "./Game.js"
import createKeyBoardListener from "./Input.js"
import RenderCanvas from "./RenderScreen.js"

$(document).ready(function() {
    const SCREEN = $("#game-canvas")[0]
    const CONTEXT = SCREEN.getContext("2d")

    const CANVAS_SIZEX = SCREEN.width
    const CANVAS_SIZEY = SCREEN.height

    const CURRENTPLAYER_ID = "Player1"

    const GAME = CreateGame(CANVAS_SIZEX, CANVAS_SIZEY)
    const KEYBOARD_LISTENER = createKeyBoardListener(CURRENTPLAYER_ID)
    KEYBOARD_LISTENER.subscribe(GAME.MovePlayer)

    GAME.AddPlayer({ Player_ID: "Player1", Player_X: 0, Player_Y: 0})
    GAME.AddFruit({ FRUIT_ID: "Fruit1" , Fruit_X: 4, Fruit_Y: 4})

    RenderCanvas(GAME, CONTEXT, CANVAS_SIZEX, CANVAS_SIZEY)
})