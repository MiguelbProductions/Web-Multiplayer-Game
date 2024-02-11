export default function CreateGame() {
    const STATE = {
        Players: {},
        Fruits: {},
        Size: {
            width: 10,
            height: 10
        }
    } 
    const observers = []

    function Subscribe(ObserverFunction) {
        observers.push(ObserverFunction)
    }

    function NotifyAll(command) {
        for (const ObserverFunction of observers) {
            ObserverFunction(command)
        }
    }
    
    function SetState(newState) {
        Object.assign(STATE, newState)
    }

    function AddPlayer(command) {
        const PLAYER_ID = command.Player_ID
        const PLAYER_X = "PLAYER_X" in command ? command.PLAYER_X : Math.floor(Math.random() * STATE.Size.width)
        const PLAYER_Y  = "PLAYER_Y" in command ? command.PLAYER_Y : Math.floor(Math.random() * STATE.Size.height)

        STATE.Players[PLAYER_ID] = {
            x: PLAYER_X,
            y: PLAYER_Y
        }

        NotifyAll({
            type: "AddPlayer",
            Player_ID: PLAYER_ID,
            PLAYER_X: PLAYER_X,
            PLAYER_Y: PLAYER_Y
        })
    }

    function RemovePlayer(command) {
        const PLAYER_ID = command.Player_ID

        delete STATE.Players[PLAYER_ID]

        NotifyAll({
            type: "RemovePlayer",
            Player_ID: PLAYER_ID,
        })
    }

    function AddFruit(command) {
        const FRUIT_ID = command && typeof command === 'object' && "Fruit_ID" in command ? command.FRUIT_ID : Math.floor(Math.random() * 10000000);
        const FRUIT_X = command && typeof command === 'object' && "Fruit_X" in command ? command.FRUIT_X : STATE && STATE.Size && typeof STATE.Size.width === 'number' ? Math.floor(Math.random() * STATE.Size.width) : 0; 
        const FRUIT_Y = command && typeof command === 'object' && "Fruit_Y" in command ? command.FRUIT_Y : STATE && STATE.Size && typeof STATE.Size.width === 'number' ? Math.floor(Math.random() * STATE.Size.width) : 0; 
    

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
        SetState,
        Subscribe,
        AddPlayer,
        RemovePlayer,
        AddFruit,
        RemoveFruit,
        MovePlayer
    }
}