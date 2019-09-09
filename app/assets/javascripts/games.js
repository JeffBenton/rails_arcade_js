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
    $(".create-game-container").load("/games/form");
    $("#game-form-button").html("<button class='btn btn-primary never-mind'>Never mind</button>");
    $(document).on("click", ".never-mind", () => {
       neverMind();
    });

    $(document).on("submit", ".create-game-form", (e) => {
       e.preventDefault();
       const values = $(".create-game-form").serialize();
       const posting = $.post('/games', values);

       posting.done(data => {
           if (data.hasOwnProperty("id")) {
               handleSuccess();
           }
           else {
               handleErrors(data);
           }
       });
    });
};

const handleSuccess = () => {
    neverMind();
    if ($("#all-games")[0].innerText != "") {
        $("#all-games")[0].innerText = "";
        $(".all-games").click();
    }
    if ($("#playable-games")[0].innerText != "") {
        $("#playable-games")[0].innerText = "";
        $(".playable-games").click();
    }
};

const handleErrors = (errors) => {
    $(".errors").html("");
    for (const i in errors) {
        $(".errors").append(`<div>${i} ${errors[i].join(" and ")}</div>`)
    }
};

const neverMind = () => {
    $(".create-game-container").html("");
    $(".errors").html("");
    $("#game-form-button").html("<button class='btn btn-primary create-game'>Create Game</button>");
};

const gameShowListeners = () => {
    $(document).on("click", "#previous-game", (e) => {
        e.preventDefault();
        const prevId = parseInt($("#previous-game").attr("data-id"));
        $.getJSON(`/games/${prevId}`, data => {
            const game = new Game(data);
            game.display();
            $.getJSON(`/plays/game_plays/${game.id}`, data => {
                let html = "";
                for (const i in data) {
                    const play = new Play(data[i]);
                    console.log(moment(play.created_at).format());
                    html += play.display();
                }
                $(".past-plays").html(html);
            });
        });

    });

    $(document).on("click", "#next-game", (e) => {
        e.preventDefault();
        const nextId = parseInt($("#next-game").attr("data-id"));
        $.getJSON(`/games/${nextId}`, data => {
            const game = new Game(data);
            game.display();
            $.getJSON(`/plays/game_plays/${game.id}`, data => {
                let html = "";
                for (const i in data) {
                    const play = new Play(data[i]);
                    html += play.display();
                }
                $(".past-plays").html(html);
            });
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