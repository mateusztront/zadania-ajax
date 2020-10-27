import {
    apiDeleteUser,
    apiLoadData,
    apiUpdateUser,
} from "./_api";
import {pubsub} from "./_pubsub";

class List {
    constructor() {
        this.ul = document.querySelector(".users");

        pubsub.subscribe("newUser", ({id, name, surname, email}) => {
            const li = document.createElement("li");
            li.dataset.id = id;
            li.innerHTML = getUserElementHTML({
                name,
                surname,
                email
            });
            li.classList.add("user-new");
            this.ul.prepend(li);
            setTimeout(() => {
                li.classList.remove("user-new");
            }, 1000);
        })

        this.loadUserList();
        this.bindEvents();
    }

    getUserElementHTML({name, surname, email}) {
        return `
            <div className="user-content">
                <p class="user-name">
                    <span>Imię:</span>
                    <strong data-name="name">${name}</strong>
                </p>
                <p class="user-surname">
                    <span>Nazwisko:</span>
                    <strong data-name="surname">${surname}</strong>
                </p>
                <p class="user-email">
                    <span>Email:</span>
                    <strong data-name="email">${email}</strong>
                </p>
            </div>
            <div class="user-actions">
                <button type="button" class="btn-edit" title="Edytuj">
                    Edit
                </button>
                <button type="button" class="btn-delete" title="Usuń">
                    Delete
                </button>
                <button type="button" class="btn-save" title="Zapisz" hidden>
                    Save
                </buton>
                <button type="button" class="btn-cancel" title="Anuluj" hidden>
                    Cancel
                </button>
            </div>
        `
    }

    loadUserList() {
        this.ul.innerHTML = "";

        apiLoadData().then(res => {
            res.forEach(user => {
                const {first_name : name, last_name : surname, email, id} = user;
                const li = document.createElement('li');
                li.dataset.id = id;
                li.innerHTML = this.getUserElementHTML({name, surname, email});
                this.ul.prepend(li);
            })
        }).catch(err => {
            console.log(err);
        });
    }

    bindEvents() {
        document.addEventListener("click", e => {
            if (e.target.classList.contains("btn-delete")) {
                const li = e.target.closest("li");
                const id = li.dataset.id;
                apiDeleteUser(id).then(res => {
                    li.remove();
                })
            }

            if (e.target.classList.contains("btn-edit")) {
                const li = e.target.closest("li");
                const id = li.dataset.id;

                li.querySelector(".btn-save").hidden = false;
                li.querySelector(".btn-cancel").hidden = false;
                li.querySelector(".btn-edit").hidden = true;
                li.querySelector(".btn-delete").hidden = true;

                const name = li.querySelector("[data-name=name]");
                const surname = li.querySelector("[data-name=surname]");
                const email = li.querySelector("[data-name=email]");

                [name, surname, email].forEach(el => {
                    const input = document.createElement("input");
                    input.type = "text";
                    input.value = el.innerText;
                    input.name = el.dataset.name;
                    el.parentElement.replaceChild(input, el);
                })
            }

            if (e.target.classList.contains("btn-cancel")) {
                const li = e.target.closest("li");
                const id = li.dataset.id;

                li.querySelector(".btn-save").hidden = true;
                li.querySelector(".btn-cancel").hidden = true;
                li.querySelector(".btn-edit").hidden = false;
                li.querySelector(".btn-delete").hidden = false;

                const elName = li.querySelector("input[name=name]");
                const elSurname = li.querySelector("input[name=surname]");
                const elEmail = li.querySelector("input[name=email]");

                [elName, elSurname, elEmail].forEach(el => {
                    const strong = document.createElement("strong");
                    strong.dataset.name = el.name;
                    strong.innerText = el.value;
                    el.parentElement.replaceChild(strong, el);
                })
            }

            if (e.target.classList.contains("btn-save")) {
                const li = e.target.closest("li");
                const id = li.dataset.id;

                const elName = li.querySelector("input[name=name]");
                const elSurname = li.querySelector("input[name=surname]");
                const elEmail = li.querySelector("input[name=email]");

                const name = elName.value;
                const surname = elSurname.value;
                const email = elEmail.value;

                apiUpdateUser({id, name, surname, email}).then(res => {
                    li.querySelector(".btn-save").hidden = true;
                    li.querySelector(".btn-cancel").hidden = true;
                    li.querySelector(".btn-edit").hidden = false;
                    li.querySelector(".btn-delete").hidden = false;

                    [elName, elSurname, elEmail].forEach(el => {
                        const strong = document.createElement("strong");
                        strong.dataset.name = el.name;
                        strong.innerText = el.value;
                        el.parentElement.replaceChild(strong, el);
                    })
                })
            }
        })
    }
}

new List();
