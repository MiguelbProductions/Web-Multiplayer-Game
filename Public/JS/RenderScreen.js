export default function RenderCanvas(GAME, CONTEXT, PLAYERID) {
    CONTEXT.clearRect(0, 0, GAME.STATE.Screen.width * 10, GAME.STATE.Screen.height * 10); 

    CONTEXT.fillStyle = "gray";
    for (const [key, Player] of Object.entries(GAME.STATE.Players)) {
        if (key !== PLAYERID) CONTEXT.fillRect(Player.x, Player.y, 1, 1); 
    }

    CONTEXT.fillStyle = "green";
    for (const [key, Fruit] of Object.entries(GAME.STATE.Fruits)) {
        CONTEXT.fillRect(Fruit.x, Fruit.y, 1, 1);
    }

    CONTEXT.fillStyle = "black";
    const currentPlayer = GAME.STATE.Players[PLAYERID];
    if (currentPlayer) CONTEXT.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)

    requestAnimationFrame(() => {
        RenderCanvas(GAME, CONTEXT, PLAYERID);
    });
}
