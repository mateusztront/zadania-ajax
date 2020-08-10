(async function() {
    const table = document.querySelector(".tab");
    const btnPrev = document.querySelector("#prev");
    const btnNext = document.querySelector("#next");
    const tbody = table.querySelector("tbody");
    const cnt = document.querySelector(".tab-cnt");

    const state = {
        page : 1, //zaczynamy od 1 strony
        limit : 20,
        sort : "",
        order : ""
    }

    const apiUrl = `http://localhost:3000/users`

    function generateLink() {
        let url = `${apiUrl}?_page=${state.page}&_limit=${state.limit}`;
        if (state.sort !== "") url += `&_sort=${state.sort}`;
        if (state.sort !== "") url += `&_order=${state.order}`;
        return url;
    }

    async function loadData() {
        const url = generateLink();
        const request = await fetch(url);
        if (request.ok) {
            setButtonsState(request)
            return request.json();
        }
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

    function parseHeaderLinkData(request) {
        const headerLink = request.headers.get("link");

        let arrData = headerLink.split("link:")
        const data = (arrData.length === 2)? arrData[1]: headerLink;
        let parsedData = {}

        arrData = data.split(",")
        if (arrData.length == 1 && arrData[0] == "") {
            return {}
        }

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
    })

    btnNext.addEventListener("click", async e => {
        state.page++;
        const data = await loadData();
        await fillTable(data);
    })

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

    const data = await loadData();
    fillTable(data);
})();