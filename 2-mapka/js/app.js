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

document.addEventListener('DOMContentLoaded', function() {
    const select = document.querySelector("#countrySelect");

    //zadanie 1
    fetch("https://restcountries.eu/rest/v2/all?fields=iso2Code;name")
        .then(res => res.json())
        .then(res => {
            for (const el of res) {
                const option = document.createElement("option");
                option.value = el.name;
                option.innerText = el.name;
                select.appendChild(option);
            }
            select.removeAttribute("disabled");

            //dodatkowo odpale dla selekta change, by od razu bylo wybrane 1 panstwo
            const change = new Event("change");
            select.dispatchEvent(change)
        })

    //zadanie 2
    select.addEventListener("change", function() {
        const name = encodeURI(this.value);
        fetch(`https://restcountries.eu/rest/v2/name/${name}`)
            .then(res => res.json())
            .then(res => {
                const country = res[0];
                //console.log(country)

                const el = document.querySelector('#countryData');
                el.innerHTML = `
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
                        Strefa czasowa: <strong>${country.timezones}</strong>
                    </div>
                `;

                //zadanie 3
                const flag = document.querySelector("#countryFlag");
                flag.setAttribute("src", country.flag);

                //zadanie 4
                map.setView([country.latlng[0], country.latlng[1]], 5);
            });
    });

});