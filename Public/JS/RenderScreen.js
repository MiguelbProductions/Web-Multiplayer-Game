export default function RenderCanvas(GAME, CONTEXT) {
    CONTEXT.fillStyle = "white"
    CONTEXT.clearRect(0, 0, GAME.STATE.Size.width, GAME.STATE.Size.height)

    for (const [key, Player] of Object.entries(GAME.STATE.Players)) {
        CONTEXT.fillStyle = "black"
        CONTEXT.fillRect(Player.x, Player.y, 1, 1)
    }

    for (const [key, Fruit] of Object.entries(GAME.STATE.Fruits)) {
        CONTEXT.fillStyle = "green"
        CONTEXT.fillRect(Fruit.x, Fruit.y, 1, 1)
    }

    requestAnimationFrame(() => {
        RenderCanvas(GAME, CONTEXT, GAME.STATE.Size.width, GAME.STATE.Size.height)
    })
}