export default function createKeyBoardListener() {
    const STATE = {
        observers: [],
        PlayerID: "",
        nextMoveAllowedAt: 0,
    };

    function RegisterPlayerID(command) {
        STATE.PlayerID = command.PlayerID;
    }

    function subscribe(ObserverFunction) {
        STATE.observers.push(ObserverFunction);
    }

    function notifyAll(command) {
        const now = Date.now();
        if (now < STATE.nextMoveAllowedAt) return;

        for (const ObserverFunction of STATE.observers) {
            ObserverFunction(command);
        }

        STATE.nextMoveAllowedAt = now + 100;
    }

    $(document).on("keydown", (event) => {
        const COMMAND = {
            type: "MovePlayer",
            Player_ID: STATE.PlayerID,
            Key_Pressed: event.key,
        };

        notifyAll(COMMAND);
    });

    return {
        RegisterPlayerID,
        subscribe,
    };
}
