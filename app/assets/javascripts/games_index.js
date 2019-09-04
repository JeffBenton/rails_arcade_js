$(() => {
    gamesListeners();
});

const gamesListeners = () => {
    $(document).on("click", ".all-games", () => {
        if($("#all-games")[0].innerText == "") {
            $.getJSON("/games", data => {
                for (const i in data) {
                    const game_link = `<div><a href="/games/${data[i].id}">${data[i].name}</a></div>`;
                    $("#all-games").append(game_link);
                }
            });
        }
    });

    $(document).on("click", ".playable-games", () => {
        if($("#playable-games")[0].innerText == "") {
            $.getJSON("/games/playable", data => {
                for (const i in data) {
                    const game_link = `<a href="/games/${data[i].id}">${data[i].name}</a> <br>`;
                    $("#playable-games").append(game_link);
                }
            });
        }
    });
}

