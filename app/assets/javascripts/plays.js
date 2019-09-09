class Play {
    constructor(data) {
        this.id = data.id;
        this.difficulty = data.difficulty;
        this.created_at = data.created_at;
        this.user = new User(data.user);
    }

    display () {
        return `<div class="row col">${this.user.name} on ${this.difficulty} at ${this.format_date()}</div>`;
    }

    format_date () {
        return moment(this.created_at).format("h:mma MMM D, YYYY");
    }
}