import {apiAddUser} from "./_api";
import {getUserElementHTML} from "./_list";

export function addForm(ul) {
    const formAdd = document.querySelector("#formAdd");
    formAdd.addEventListener("submit", e => {
        e.preventDefault();
        const inputName = formAdd.querySelector("input[name=name]");
        const inputSurname = formAdd.querySelector("input[name=surname]");
        const inputEmail = formAdd.querySelector("input[name=email]");

        if (inputName.value && inputSurname.value && inputEmail.value) {
            apiAddUser(inputName.value, inputSurname.value, inputEmail.value).then(res => {
                const li = document.createElement("li");
                li.dataset.id = res.id;
                li.innerHTML = getUserElementHTML({
                    name : res.first_name,
                    surname : res.last_name,
                    email : res.email
                });
                li.classList.add("user-new");
                ul.prepend(li);
                setTimeout(() => {
                    li.classList.remove("user-new");
                }, 1000);
            })
        } else {
            alert("Wypełnij poprawnie wszystkie pola");
        }
    })
}