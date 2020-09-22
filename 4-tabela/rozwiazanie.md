### Rozwiązanie

Zacznijmy od pobrania wszystkich niezbędnych niezbędnych do oprogramowania działania tabeli.
W naszym kodzie skorzystamy ze składni await/async:

```js
(async function() {
    const table = document.querySelector(".tab");
    const btnPrev = document.querySelector("#prev");
    const btnNext = document.querySelector("#next");
    const tbody = table.querySelector("tbody");
    const cnt = document.querySelector(".tab-cnt");
})();
```

Wykonajmy teraz połączenie na wskazany adres i wypełnijmy tabelę danymi:

```js
(async function() {
    ...
    const apiUrl = `http://localhost:3000/users`
    const request = await fetch(`${apiUrl}`);
    console.log(request.json())
})();
```

Zobaczysz, że zwróconych danych jest bardzo dużo. Żeby otrzymać stronicowane dane, musimy wykonać połączenie na nieco inny adres:


```js
(async function() {
    ...
    const apiUrl = `http://localhost:3000/users`
    const request = await fetch(`${apiUrl}?_page=${state.page}&_limit=${state.limit}`);
    console.log(request.json())
})();
```

Potrzebujemy zmiennej, która będzie wskazywać na aktualną stronę i liczbę ile ma być zwracanych rekordów. Najlepiej takie rzeczy trzymać w postaci obiektu:


```js
(async function() {
    ...
    const state = {
        page : 1, //zaczynamy od 1 strony
        limit : 20
    }

    const apiUrl = `http://localhost:3000/users`
    const request = await fetch(`${apiUrl}?_page=${state.page}&_limit=${state.limit}`);
    console.log(request.json())
})();
```

Zmodyfikujmy powyższy kod zamieniając wczytywanie na funkcję:

```js
(async function() {
    ...

    const apiUrl = `http://localhost:3000/users`
    const state = {
        page : 1 //zaczynamy od 1 strony
        limit : 20
    }

    async function loadData() {
        const request = await fetch(`${apiUrl}?_page=${state.page}&_limit=${state.limit}`);
        return request.json();
    }
})();
```

Po wczytaniu danych powinniśmy je wrzucić do tabeli:

```js
(async function() {
    ...

    const apiUrl = `http://localhost:3000/users`
    const state = {
        page : 1, //zaczynamy od 1 strony
        limit : 20
    }

    async function loadData() {
        const request = await fetch(`${apiUrl}?_page=${state.page}&_limit=${state.limit}`);
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

    const data = await loadData();
    fillTable(data);
})
```

Po kliknięciu na przyciski stronicowania powinniśmy zmieniać aktualną stronę:

```js
(async function() {
    ...

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

    const data = await loadData();
    fillTable(data);
})
```

Problem jaki się pojawi to sytuacja, kiedy klikając na przycisk next/prev dojdziemy do momentu, kiedy kolejnej strony nie będzie. Gdy przejrzymy zwrócone dane, wśród nagłówków zobaczymy nagłówek **link**. W zależności od sytuacji będzie się tam znajdował link prev lub next. Możemy to wykorzystać do sprawdzania czy kolejna strona będzie istnieć i w razie czego włączania i wyłączania odpowiednich przycisków.

```js
//pobieramy dane z nagłówka link
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

async function loadData() {
    const request = await fetch(`${apiUrl}?_page=${state.page}&_limit=${state.limit}`);
    setButtonsState(request)
    return request.json();
}

...
```

### Sortowanie
W każdej z kolumn znajdują się strzałki służące do sortowania wyników w górę i dół. Gdy przyjrzysz się wyglądowi html, każda komórka hr ma atrybut data-id, który będzie wskazywał na daną, po której będziemy sortować.

Aby sortować w odpowiednim kierunku, do adresu zapytania musimy dodać dwa parametry. Parametr _sort oznacza kolumnę po której sortujemy, natomiast _order kierunek sortowania (asd lub desc):

```js
`${apiUrl}?_page=${state.page}&_limit=${state.limit}&_sort=NAZWA_KOLUMNY&_order=asd
```

Aby ułatwić sobię sprawę napiszmy funkcję, która będzie generować dla nas odpowiedni url oraz dodajmy do state dwie dodatkowe zmienne:

```js
const state = {
    page : 1,
    limit : 20,
    sort : "",
    order : ""
}

function generateLink() {
    let url = `${apiUrl}?_page=${state.page}&_limit=${state.limit}`;
    if (state.sort !== "") url += `&_sort=${state.sort}`;
    if (state.sort !== "") url += `&_order=${state.order}`;
    return url;
}

async function loadData() {
    const url = generateLink();
    const request = await fetch(url);
    setButtonsState(request)
    return request.json();
}
```

Pobierzmy wszystkie strzałki i dodajmy im kliknięcie:

```js
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
```

### Obsługa formularza
Pobieramy formularz i podpinamy mu zdarzenie wysłania.

```js
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
```

Pobieramy dane z formularza. Następnie ustawiamy je w state.filter.
Dodajmy tą właściwość do obiektu state i wykorzystajmy ją przy tworzeniu adresu połączenia modyfikując funkcję generateLink:

```js
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
```