document.addEventListener('DOMContentLoaded', function() {

    const apiUrl = 'https://jsonplaceholder.typicode.com/';

    const template = document.querySelector('#template');
    const templatePost = document.querySelector("#post");
    const list = document.querySelector("#usersList");

    fetch(apiUrl + "users")
        .then(res => res.json())
        .then(res => {
            console.log(res)

            for (const user of res) {
                //dodatkowe - mozna tez po prostu za pomoca template string
                //wpisac caly kod danego elementu
                let html = template.innerHTML;
                html = html.replace(/{{userName}}/g, user.name);
                html = html.replace(/{{phone}}/g, user.phone);
                html = html.replace(/{{email}}/g, user.email);

                const newEl = document.createElement('article');
                newEl.classList.add('user-cnt');
                newEl.innerHTML = html;
                newEl.dataset.id = user.id;

                list.appendChild(newEl);
            }
        })


    list.addEventListener("click", function(e) {
        //propagacja zdarzen.
        //Jeżeli klikniety element to .show-posts...
        if (e.target.classList.contains("show-posts")) {
            const btn = e.target;
            //pobieram artykuł
            const parent = btn.closest("article");
            //pobieram miejsce na posty
            const postPlace = parent.querySelector('.user-posts');
            //pobieram ID usera z artykułu
            const userID = parent.dataset.id;

            //po sciagnieciu danych dodam flage by nie sciagac jeszcze raz
            if (!parent.dataset.downloaded) {

                fetch(apiUrl + "posts?userId=" + userID)
                    .then(res => res.json())
                    .then(res => {
                        for (const post of res) {
                            let html = templatePost.innerHTML;
                            html = html.replace(/{{title}}/g, post.title);
                            html = html.replace(/{{body}}/g, post.body);
                            const newEl = document.createElement("li");;
                            newEl.innerHTML = html;
                            newEl.classList.add("post")

                            postPlace.append(newEl);

                            postPlace.style.display = "block"
                            btn.innerText = "Hide posts";
                            parent.dataset.downloaded = true; //flaga
                        }
                    });
            } else {
                //jak juz sciagnalem to nie bede wrzucal postow tylko je pokazywal/uktrywał
                if (postPlace.style.display !== "block") {
                    postPlace.style.display = "block";
                    btn.innerText = "Hide posts";
                } else {
                    postPlace.style.display = "none"
                    btn.innerText = "Show posts";
                }
            }
        }
    })

});