const map = L.map('mapid').setView([51.919437, 19.145136], 5);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoia2FydG9mZWxlazAwNyIsImEiOiJjanRpazhyM2owbHUwNDluem40Ynljdm5hIn0.kYoJkNni5ksRyA0gy1yV7A'
}).addTo(map);

/*----------------------------------------------------
 !!! powyzszego nie ruszaj, to mapa wstawiona za pomocą leafletjs
 wzorowana na tutorialu ze strony: https://leafletjs.com/examples/quick-start/
 Skrypt pisz poniżej
 ----------------------------------------------------*/

document.addEventListener('DOMContentLoaded', async () => {

    const select = document.querySelector("#countrySelect");

    async function loadData() {
        const xhr = await fetch(" https://restcountries.eu/rest/v2/all?fields=iso2Code;name")
        const json = await xhr.json();

        for (let el of json) {
            const option = document.createElement("option");
            option.innerText = el.name;
            option.value = el.name;
            select.append(option);
        }
        select.disabled = false;
    }

    async function loadCountryData(name) {
        const xhr = await fetch("https://restcountries.eu/rest/v2/name/" + name);
        const json = await xhr.json();
        return json;
    }

    await loadData();
    select.addEventListener("change", async e => {
        const val = select.value;

        const countryData = await loadCountryData(val);
        const country = countryData[0];

        const countryDataEl = document.querySelector("#countryData");
        countryDataEl.innerHTML = `
            <h3 class="country-name">
                ${country.name}
            </h3>
            <div>
                Stolica: <strong>${country.capital}</strong>
            </div>
            <div>
                Region: <strong>${country.region}</strong>
            </div>
            <div>
                Podregion: <strong>${country.subregion}</strong>
            </div>
            <div>
                Liczba ludności: <strong>${country.population}</strong>
            </div>
            <div>
                Strefa czasowa: <strong>${country.timezones[0]}</strong>
            </div>
        `;

        const flag = document.querySelector('#countryFlag');
        flag.src = country.flag;

        map.setView([country.latlng[0], country.latlng[1]], 5);
    })
});