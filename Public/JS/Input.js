export default function createKeyBoardListener() {
    const STATE = {
        observers: [],
        PlayerID: ""
    }

    function RegisterPlayerID(command) {
        STATE.PlayerID = command.PlayerID
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
            type: "MovePlayer",
            Player_ID: STATE.PlayerID,
            Key_Pressed: event.key
        }

        notifyAll(COMMAND)
    })

    return {
        RegisterPlayerID,
        subscribe
    }
}