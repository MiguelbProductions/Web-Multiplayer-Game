$(document).ready(function() {
    const SCREEN = $("#game-canvas")[0]
    const CONTEXT = SCREEN.getContext("2d")

    const CANVAS_SIZEX = SCREEN.width
    const CANVAS_SIZEY = SCREEN.height

    const CURRENTPLAYER_ID = "Player1"
    
    function CreateGame() {
        const STATE = {
            Players: {},
            Fruits: {}
        } 

        function AddPlayer(command) {
            const PLAYER_ID = command.Player_ID
            const PLAYER_X = command.Player_X
            const PLAYER_Y  = command.Player_Y

            STATE.Players[PLAYER_ID] = {
                x: PLAYER_X,
                y: PLAYER_Y
            }
        }

        function RemovePlayer(command) {
            const PLAYER_ID = command.Player_ID

            delete STATE.Players[PLAYER_ID]
        }

        function AddFruit(command) {
            const FRUIT_ID = command.Fruit_ID
            const FRUIT_X = command.Fruit_X
            const FRUIT_Y  = command.Fruit_Y

            STATE.Fruits[FRUIT_ID] = {
                x: FRUIT_X,
                y: FRUIT_Y
            }
        }

        function RemoveFruit(command) {
            const FRUIT_ID = command.Fruit_ID

            delete STATE.Fruits[FRUIT_ID]
        }

        function CheckForFruitCollision(Player) {
            for (const [key, Fruit] of Object.entries(STATE.Fruits)) {
                if (Player.x == Fruit.x && Player.y == Fruit.y) RemoveFruit({ Fruit_ID: key })
            }
        }

        function MovePlayer(command) {
            const CURRENT_PLAYER = STATE.Players[command.Player_ID];
        
            const PossibleMoves = {
                ArrowUp(Player) {
                    if (Player.y > 0) Player.y -= 1
                },
                w(Player) {
                    if (Player.y > 0) Player.y -= 1
                },
                ArrowDown(Player) {
                    if (Player.y < CANVAS_SIZEY - 1) Player.y += 1
                },
                s(Player) {
                    if (Player.y < CANVAS_SIZEY - 1) Player.y += 1
                },
                ArrowRight(Player) {
                    if (Player.x < CANVAS_SIZEX - 1) Player.x += 1
                },
                d(Player) {
                    if (Player.x < CANVAS_SIZEX - 1) Player.x += 1
                },
                ArrowLeft(Player) {
                    if (Player.x > 0) Player.x -= 1
                },
                a(Player) {
                    if (Player.x > 0) Player.x -= 1
                },
            };
        
            const MoveFunction = PossibleMoves[command.Key_Pressed];
        
            if (MoveFunction) {
                MoveFunction(CURRENT_PLAYER);
                CheckForFruitCollision(CURRENT_PLAYER);
            }
        }
        

        return {
            STATE,
            AddPlayer,
            RemovePlayer,
            AddFruit,
            RemoveFruit,
            MovePlayer
        }
    }

    function createKeyBoardListener() {
        const STATE = {
            observers: []
        }

        function subscribe(ObserverFunction) {
            STATE.observers.push(ObserverFunction)
        }

        function notifyAll(command) {
            for (const ObserverFunction of STATE.observers) {
                ObserverFunction(command)
            }
        }

        $(document).on("keydown", (event) => {        
            const COMMAND = {
                Player_ID: CURRENTPLAYER_ID,
                Key_Pressed: event.key
            }
    
            notifyAll(COMMAND)
            
        })

        return {
            subscribe
        }
    }

    const GAME = CreateGame()
    const KEYBOARD_LISTENER = createKeyBoardListener()
    KEYBOARD_LISTENER.subscribe(GAME.MovePlayer)

    GAME.AddPlayer({ Player_ID: "Player1", Player_X: 0, Player_Y: 0})
    GAME.AddFruit({ FRUIT_ID: "Fruit1" , Fruit_X: 4, Fruit_Y: 4})

    function RenderCanvas() {
        CONTEXT.fillStyle = "white"
        CONTEXT.clearRect(0, 0, CANVAS_SIZEX, CANVAS_SIZEY)

        for (const [key, Player] of Object.entries(GAME.STATE.Players)) {
            CONTEXT.fillStyle = "black"
            CONTEXT.fillRect(Player.x, Player.y, 1, 1)
        }
    
        for (const [key, Fruit] of Object.entries(GAME.STATE.Fruits)) {
            CONTEXT.fillStyle = "green"
            CONTEXT.fillRect(Fruit.x, Fruit.y, 1, 1)
        }

        requestAnimationFrame(RenderCanvas)
    }


    RenderCanvas()
})