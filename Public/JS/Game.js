export default function CreateGame() {
    const STATE = {
        Players: {},
        Fruits: {},
        Size: {
            width: 10,
            height: 10
        }
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
                if (Player.y < STATE.Size.height - 1) Player.y += 1
            },
            s(Player) {
                if (Player.y < STATE.Size.height - 1) Player.y += 1
            },
            ArrowRight(Player) {
                if (Player.x < STATE.Size.width - 1) Player.x += 1
            },
            d(Player) {
                if (Player.x < STATE.Size.width - 1) Player.x += 1
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