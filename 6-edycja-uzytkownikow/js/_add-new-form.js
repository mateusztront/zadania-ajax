import {apiAddUser} from "./_api";
import {pubsub} from "./_pubsub";

class AddForm {
    constructor() {
        this.formAdd = document.querySelector("#formAdd");
    }

    bindEvents() {
        this.formAdd.addEventListener("submit", e => {
            e.preventDefault();
            const inputName = this.formAdd.querySelector("input[name=name]");
            const inputSurname = this.formAdd.querySelector("input[name=surname]");
            const inputEmail = this.formAdd.querySelector("input[name=email]");

            if (inputName.value && inputSurname.value && inputEmail.value) {
                apiAddUser(inputName.value, inputSurname.value, inputEmail.value).then(res => {
                    pubsub.emit("newUser", {
                        id : res.id,
                        name : res.first_name,
                        surname : res.last_name,
                        email: res.email
                    })
                })
                this.formAdd.reset(); //czyszczę pola
            } else {
                alert("Wypełnij poprawnie wszystkie pola");
            }
        })
    }
}

new AddForm();
