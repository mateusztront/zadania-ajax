(async function() {
    const table = document.querySelector(".tab");
    const btnPrev = document.querySelector("#prev");
    const btnNext = document.querySelector("#next");
    const tbody = table.querySelector("tbody");
    const cnt = document.querySelector(".tab-cnt");

    const apiUrl = `http://localhost:3000/users`;
    const state = {
        limit : 10,
        page : 1,
        sort : "",
        order : "asd", //desc
        filter : {}
    }

    function generateLink() {
        let url = `${apiUrl}?_page=${state.page}&_limit=${state.limit}`;
        if (state.sort !== "") url += `&_sort=${state.sort}`;
        if (state.sort !== "") url += `&_order=${state.order}`;

        for (let [key, val] of Object.entries(state.filter)) {
            if (val !== "") url += `&${key}_like=${val}`;
        }

        return url;
    }

    async function loadData() {
        const url = generateLink();
        const request = await fetch(url);
        setButtonsState(request)
        return request.json();
    }

    async function fillTable(data) {
        tbody.innerHTML = ``;
        for (let el of data) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${el.id}</td>
                <td>${el.first_name}</td>
                <td>${el.last_name}</td>
                <td>${el.email}</td>
                <td>${el.gender}</td>
                <td>${el.ip_address}</td>
            `;
            tbody.appendChild(tr);
        }
    }

    function parseHeaderLinkData(data) {
        const headerLink = data.headers.get("link");

        let arrData = headerLink.split("link:")
        arrData = arrData.length == 2? arrData[1]: arrData[0];

        arrData = arrData.split(",")
        if (arrData.length == 1 && arrData[0] == "") {
            return {}
        }

        let parsedData = {}
        for (let d of arrData){
            const linkInfo = /<([^>]+)>;\s+rel="([^"]+)"/ig.exec(d)

            parsedData[linkInfo[2]] = linkInfo[1]
        }

        return parsedData;
    }

    //ustawia stan przycisków stronicowania
    function setButtonsState(request) {
        const links = parseHeaderLinkData(request);

        if (links.prev) {
            btnPrev.dataset.url = links.prev;
            btnPrev.disabled = false;
        } else {
            delete btnPrev.dataset.url
            btnPrev.disabled = true;
        }
        if (links.next) {
            btnNext.dataset.url = links.next;
            btnNext.disabled = false;
        } else {
            delete btnNext.dataset.url
            btnNext.disabled = true;
        }
    }

    btnPrev.addEventListener("click", async e => {
        state.page--;
        state.page = Math.max(state.page, 1);
        const data = await loadData();
        await fillTable(data);
    });

    btnNext.addEventListener("click", async e => {
        state.page++;
        const data = await loadData();
        await fillTable(data);
    });

    const arrows = table.querySelectorAll(".arrow");
    for (let el of arrows) {
        el.addEventListener("click", async e => {
            const th = e.currentTarget.closest("th");
            const orderDest = th.dataset.order === "desc";

            arrows.forEach(el => {
                el.closest("th").removeAttribute("data-order")
            });

            if (orderDest) {
                th.dataset.order = "asd"
            } else {
                th.dataset.order = "desc"
            }

            state.sort = th.dataset.id;
            state.order = th.dataset.order;

            const data = await loadData();
            fillTable(data);
        })
    }



    const form = document.querySelector("form");
    form.addEventListener("submit", async e => {
        e.preventDefault();

        const formData = new FormData(form);
        for (var key of formData.keys()) {
            const val = formData.get(key);
            if (formData !== "") {
                state.filter[key] = val;
            }
        }

        state.sort = "";
        state.order = "asd";
        state.page = 1;

        const data = await loadData();
        fillTable(data);
    });


    const data = await loadData();
    fillTable(data);


})();