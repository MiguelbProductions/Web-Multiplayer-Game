import CreateGame from "./Game.js"
import createKeyBoardListener from "./Input.js"
import RenderCanvas from "./RenderScreen.js"

$(document).ready(function() {
    const SCREEN = $("#game-canvas")[0]
    const CONTEXT = SCREEN.getContext("2d")

    const GAME = CreateGame()
    const KEYBOARD_LISTENER = createKeyBoardListener()
    const SOCKET = io()

    function askForName() {
        var name = prompt("Your Name: ");

        if (name) SOCKET.emit("CheckName", { name: name })
        else {
            alert("Name cannot be empty. Please choose one name.")
            askForName()
        }
    }

    SOCKET.on('NameExists', function() {
        alert("Name already in use. Please choose another.")
        askForName()
    });

    SOCKET.on('NameAccepted', function() {
        const PLAYERID = SOCKET.id
        
        console.log(`Player connected on client with id ${PLAYERID}`)

        RenderCanvas(GAME, CONTEXT, PLAYERID)
    });

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

    SOCKET.on("SetGlobalScore", (command) => {
        for (const [key, Player] of Object.entries(GAME.STATE.Players)) {
            GAME.STATE.Players[key].points = command.Players[key].points
        }
        
        const tbody = document.querySelector("#ScoreBoard-Table tbody");
        tbody.innerHTML = '';

        for (const [playerID, playerInfo] of Object.entries(GAME.STATE.Players)) {
            updateScoreBoard(playerID, playerInfo);
        }
    }); 

    askForName()

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
                nameCell.innerText = playerInfo.name;
        
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
    $("#clear-score").click(() => { SOCKET.emit("ClearScore") })

    $('#toggle-walls').on('change', function() {
        const shouldWrap = $(this).is(':checked');
        
        SOCKET.emit("SetGlobalWallWrapping", { shouldWrap: shouldWrap })
    });
})