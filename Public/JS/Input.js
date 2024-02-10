export default function createKeyBoardListener(CURRENTPLAYER_ID) {
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