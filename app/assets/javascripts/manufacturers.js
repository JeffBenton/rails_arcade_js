class Manufacturer {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }

    addToSelect() {
        $("select").append(`<option value="${this.id}">${this.name}</option>`)
    }
}