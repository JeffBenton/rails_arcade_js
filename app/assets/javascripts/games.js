$(() => {
    gamesIndexListeners();
    gameShowListeners();
});

const gamesIndexListeners = () => {
    $(document).on("click", ".all-games", () => {
        if($("#all-games")[0].innerText === "") {
            $.getJSON("/games", data => {
                for (const i in data) {
                    const game = new Game(data[i]);
                    $("#all-games").append(game.gameLink());
                }
            });
        }
    });

    $(document).on("click", ".playable-games", () => {
        if($("#playable-games")[0].innerText === "") {
            $.getJSON("/games/playable", data => {
                for (const i in data) {
                    const game = new Game(data[i]);
                    $("#playable-games").append(game.gameLink());
                }
            });
        }
    });
};

const gameShowListeners = () => {
    $(document).on("click", "#previous-game", (e) => {
        e.preventDefault();
        const prevId = parseInt($("#previous-game").attr("data-id"));
        $.getJSON(`/games/${prevId}`, data => {
            const game = new Game(data);
            game.display();
        });
    });

    $(document).on("click", "#next-game", (e) => {
        e.preventDefault();
        const nextId = parseInt($("#next-game").attr("data-id"));
        $.getJSON(`/games/${nextId}`, data => {
            const game = new Game(data);
            game.display();
        });
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

    display() {
        const content = `
        <div class="row">
            <h2 class="col col-md-10">${this.name}</h2>
         </div>
        
         <div class="row">
            <h4 class="col">${this.token_cost} tokens.</h4>
         </div>
        `;

        $(".game-content").html(content);
        $("#plays_game_id")[0].value = this.id;

        this.prevGame().then(game => {
            $("#previous-game")[0].innerText = `< ${game.name}`;
            $("#previous-game").attr("data-id", game.id);
        });

        this.nextGame().then(game => {
            $("#next-game")[0].innerText = `${game.name} >`;
            $("#next-game").attr("data-id", game.id);
        });
    }

    async nextGame() {
        let data = await $.getJSON(`/games/${this.id + 1}`);
        if (data == null) {
            data = await $.getJSON("/games/1");
        }
        return new Game(data);
    }

    async prevGame() {
        let data = await $.getJSON(`/games/${this.id - 1}`);
        if (data == null) {
            data = await $.getJSON('/games/last');
        }
        return new Game(data);
    }
}