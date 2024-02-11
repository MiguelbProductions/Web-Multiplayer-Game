import CreateGame from "./Game.js"
import createKeyBoardListener from "./Input.js"
import RenderCanvas from "./RenderScreen.js"

$(document).ready(function() {
    const SCREEN = $("#game-canvas")[0]
    const CONTEXT = SCREEN.getContext("2d")

    const CURRENTPLAYER_ID = "Player1"

    const GAME = CreateGame()
    const KEYBOARD_LISTENER = createKeyBoardListener()
    const SOCKET = io()

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
        KEYBOARD_LISTENER.subscribe((command) => {
            SOCKET.emit(command.type, command)
        })

        const players = State.Players

        for (const [playerID, playerInfo] of Object.entries(players)) {
            updateScoreBoard(playerID, playerInfo);
        }
    })

    SOCKET.on("AddPlayer", (command) => {
        GAME.AddPlayer(command)

        updateScoreBoard(command.Player_ID, GAME.STATE.Players[command.Player_ID])
    })

    SOCKET.on("RemovePlayer", (command) => {
        GAME.RemovePlayer(command)

        updateScoreBoard(command.Player_ID, GAME.STATE.Players[command.Player_ID], true)
    })

    SOCKET.on("PlayerMoved", (command) => {
        if (command.Player_ID != SOCKET.id) GAME.MovePlayer(command);
    });

    SOCKET.on("UpdateFruit", (command) => {
        GAME.STATE.Fruits = command.Fruits

        const CurrentPlayer = GAME.STATE.Players[command.Player_ID]

        if (CurrentPlayer) {
            console.log(CurrentPlayer.points)
            CurrentPlayer.points += 1

            updateScoreBoard(command.Player_ID, CurrentPlayer)
        }
    })

    SOCKET.on("RemoveFruit", (command) => {
        if (command.Player_ID == SOCKET.id) {
            SOCKET.emit("GenerateNewFruit", command)
        }
    });

    SOCKET.on("SetWallWrapping", (command) => {
        GAME.SetWallWrapping(command)
    });  

    function updateScoreBoard(playerID, playerInfo, RemovePlayer = false) {
        const playerRow = document.querySelector(`#ScoreBoard-Table tr[data-player-id="${playerID}"]`);
    
        if (RemovePlayer) {
            playerRow.remove()
        } else {
            if (playerRow) {
                const pointsCell = playerRow.querySelector("td:nth-child(2)");
                pointsCell.innerText = playerInfo.points;
            } else {
                const row = document.createElement("tr");
                row.setAttribute("data-player-id", playerID);
        
                const nameCell = document.createElement("td");
                nameCell.innerText = playerID;
        
                const pointsCell = document.createElement("td");
                pointsCell.innerText = playerInfo.points;
        
                row.appendChild(nameCell);
                row.appendChild(pointsCell);
        
                document.querySelector("#ScoreBoard-Table tbody").appendChild(row);
            }
        }
    }

    $("#start-game").click(() => { SOCKET.emit("StartGame") })
    $("#stop-game").click(() => { SOCKET.emit("StopGame") })

    $('#toggle-walls').on('change', function() {
        const shouldWrap = $(this).is(':checked');
        
        SOCKET.emit("SetGlobalWallWrapping", { shouldWrap: shouldWrap })
    });
})