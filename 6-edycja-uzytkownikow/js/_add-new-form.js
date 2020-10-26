import {apiAddUser} from "./_api";
import {pubsub} from "./_pubsub";

const formAdd = document.querySelector("#formAdd");
formAdd.addEventListener("submit", e => {
    e.preventDefault();
    const inputName = formAdd.querySelector("input[name=name]");
    const inputSurname = formAdd.querySelector("input[name=surname]");
    const inputEmail = formAdd.querySelector("input[name=email]");

    if (inputName.value && inputSurname.value && inputEmail.value) {
        apiAddUser(inputName.value, inputSurname.value, inputEmail.value).then(res => {
            pubsub.emit("newUser", {
                id : res.id,
                name : res.first_name,
                surname : res.last_name,
                email: res.email
            })
        })
        formAdd.reset(); //czyszczę pola
    } else {
        alert("Wypełnij poprawnie wszystkie pola");
    }
})