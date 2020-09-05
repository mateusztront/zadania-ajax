document.addEventListener('DOMContentLoaded', async () => {

    const list = document.querySelector("#usersList");
    const url = "https://jsonplaceholder.typicode.com/";

    async function loadUsers() {
        const xhr = await fetch(url + "users");
        const json = await xhr.json();

        for (let el of json) {
            const element = document.createElement("div");
            element.classList.add("user-cnt");
            element.dataset.id = el.id;

            const content = document.querySelector("#templateElement").content.cloneNode(true);

            const name = content.querySelector(".user-name");
            name.innerText = el.name;

            const phone = content.querySelector(".user-phone");
            phone.innerText = el.phone;

            const email = content.querySelector(".user-email");
            email.innerText = el.name;
            email.href = `mailto: ${el.email}`;

            element.append(content);
            list.append(element);
        }
    }

    async function loadPost(id) {
        const xhr = await fetch(url + "posts?userId=" + id)
        const json = await xhr.json();
        return json;
    }

    await loadUsers();

    const buttons = document.querySelectorAll(".user-show-posts");
    for (let btn of buttons) {
        btn.addEventListener("click", async e => {
            const element = btn.closest(".user-cnt");
            const id = element.dataset.id;
            const postCnt = element.querySelector(".user-posts");

            if (btn.dataset.loaded) { //czyszczę listę postów
                postCnt.innerHTML = '';
                btn.innerText = "Show posts";
                postCnt.style.display = "";
                delete btn.dataset.loaded;
            } else {
                const postData = await loadPost(id); //wczytuję listę postów

                for (let el of postData) {
                    const post = document.createElement("div");
                    post.classList.add("post");

                    const postContent = document.querySelector("#templatePost").content.cloneNode(true);
                    postContent.querySelector(".post-title").innerText = el.title;
                    postContent.querySelector(".post-body").innerText = el.body;

                    post.append(postContent);

                    postCnt.append(post);
                    postCnt.style.display = "block"
                    btn.innerText = "Hide posts";
                    btn.dataset.loaded = true;
                }
            }

        })
    }
});