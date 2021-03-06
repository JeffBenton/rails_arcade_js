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
               handleSuccess(data);
           }
           else {
               handleErrors(data);
           }
       });
    });
};

const handleSuccess = (data) => {
    neverMind();
    if ($("#all-games")[0].innerText != "") {
        $("#all-games").append(new Game(data).gameLink());
    }
    if ($("#playable-games")[0].innerText != "") {
        $("#playable-games").append(new Game(data).gameLink());
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
            const game = new Game(data[1]);
            game.display(new Game(data[0]), new Game(data[2]));
            game.displayPlays();
        });

    });

    $(document).on("click", "#next-game", (e) => {
        e.preventDefault();
        const nextId = parseInt($("#next-game").attr("data-id"));
        $.getJSON(`/games/${nextId}`, data => {
            const game = new Game(data[1]);
            game.display(new Game(data[0]), new Game(data[2]));
            game.displayPlays();
        });
    });
};

class Game {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.token_cost = data.token_cost;
        this.manufacturer_id = data.manufacturer_id;
        this.plays = data.plays.map(play => new Play(play));
    }

    gameLink() {
        return `<div><a href="/games/${this.id}">${this.name} - ${this.token_cost} Tokens</a></div>`;
    }

    display(previous, next) {
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

        $("#previous-game")[0].innerText = `< ${previous.name}`;
        $("#previous-game").attr("data-id", previous.id);

        $("#next-game")[0].innerText = `${next.name} >`;
        $("#next-game").attr("data-id", next.id);
    }

    displayPlays() {
        let html = "";
        for (const i in this.plays) {
            html += this.plays[i].display();
        }
        $(".past-plays").html(html);
    }
}