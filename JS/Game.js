$(document).ready(function() {
    const SCREEN = $("#game-canvas")[0]
    const CONTEXT = SCREEN.getContext("2d")

    const CANVAS_SIZEX = SCREEN.width
    const CANVAS_SIZEY = SCREEN.height

    const CURRENTPLAYER_ID = "Player1"

    const GAME = {
        Players: {
            "Player1": { x: 1, y: 1},
            "Player2": { x: 9, y: 9}
        },
        Fruits: {
            "Fruit1": { x: 3, y: 1}
        }
    } 

    function RenderCanvas() {
        CONTEXT.fillStyle = "white"
        CONTEXT.clearRect(0, 0, CANVAS_SIZEX, CANVAS_SIZEY)

        for (const [key, Player] of Object.entries(GAME.Players)) {
            CONTEXT.fillStyle = "black"
            CONTEXT.fillRect(Player.x, Player.y, 1, 1)
        }
    
        for (const [key, Fruit] of Object.entries(GAME.Fruits)) {
            CONTEXT.fillStyle = "green"
            CONTEXT.fillRect(Fruit.x, Fruit.y, 1, 1)
        }

        requestAnimationFrame(RenderCanvas)
    }

    $(document).on("keydown", (event) => {
        const KEYPRESSED = event.key
        const CURRENT_PLAYER = GAME.Players[CURRENTPLAYER_ID]

        switch (KEYPRESSED) {
            case "w": case "ArrowUp": 
                if (CURRENT_PLAYER.y == 0) return

                CURRENT_PLAYER.y -= 1; return
            case "s": case "ArrowDown": 
            if (CURRENT_PLAYER.y == CANVAS_SIZEY - 1) return

                CURRENT_PLAYER.y += 1; return
            case "d": case "ArrowRight": 
                if (CURRENT_PLAYER.x == CANVAS_SIZEX - 1) return

                CURRENT_PLAYER.x += 1; return
            case "a": case "ArrowLeft": 
                if (CURRENT_PLAYER.x == 0) return

                CURRENT_PLAYER.x -= 1; return
        }
    })

    RenderCanvas()
})