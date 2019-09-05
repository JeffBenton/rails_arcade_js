$(() => {
    gamesListeners();
});

const gamesListeners = () => {
    $(document).on("click", ".all-games", () => {
        if($("#all-games")[0].innerText == "") {
            $.getJSON("/games", data => {
                for (const i in data) {
                    const game = new Game(data[i]);
                    $("#all-games").append(game.gameLink());
                }
            });
        }
    });

    $(document).on("click", ".playable-games", () => {
        if($("#playable-games")[0].innerText == "") {
            $.getJSON("/games/playable", data => {
                for (const i in data) {
                    const game = new Game(data[i])
                    $("#playable-games").append(game.gameLink());
                }
            });
        }
    });
};

class Game {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.token_cost = data.token_cost;
        this.manufacturer_id = data.manufacturer_id;
    }

    gameLink() {
        return `<div><a href="/games/${this.id}">${this.name} - ${this.token_cost} Tokens</a></div>`;
    }
}