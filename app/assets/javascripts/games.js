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

    $(document).on("click", ".create-game", () => {
        newGameForm();
    });
};

const newGameForm = () => {
    const html = `
    <form class="new_game" id="new_game">
        <div class="form-group">
        <label for="game_name">Name</label>
        <input class="form-control" type="text" name="game[name]" id="game_name">
        </div>
        <br>
        <div class="form-group">
            <label for="game_token_cost">Token cost</label>
            <input class="form-control" type="number" name="game[token_cost" id="game_token_cost">
        </div>
        <br>
        <div class="form-group">
            <label for="game_manufacturer">Manufacturer</label>
            <select name="game[manufacturer]" id="game_manufacturer_id">
                <option>Choose a Manufacturer</option>
            </select>
        </div>
        <h4>Or create a new manufacturer</h4>
        <div class="form-group">
            <label for="game_manufacturer_attributes_manufacturer_name">Manufacturer Name</label>
            <input class="form-control" type="text" name="game[manufacturer_attributes][name]" id="game_manufacturer_attributes_name">
        </div>
        <input type="submit" name="commit" value="Create Game" class="btn btn-primary">
    </form>`;

    $(".create-game-container").html(html);
    $("#game-form-button").html("<button class='btn btn-primary never-mind'>Never mind</button>");
    $(document).on("click", ".never-mind", () => {
       neverMind();
    });

    $.getJSON("/manufacturers", data => {
        for (const i in data) {
            const m = new Manufacturer(data[i]);
            m.addToSelect();
        }
    });
};

const neverMind = () => {
    $(".create-game-container").html("");
    $("#game-form-button").html("<button class='btn btn-primary create-game'>Create Game</button>");
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