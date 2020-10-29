const api = "https://pixabay.com/api/";
const apiKey = "8562398-c1504851315d5b08a117bd785";

const searchForm = document.querySelector("form");
const searchInput = searchForm.querySelector("input");

const ul = document.querySelector(".gallery-list");

const btnPrev = document.querySelector("#prev");
const btnNext = document.querySelector("#next");

const imagesPerPage = 20;
const minPage = 1; //minimalna strona to 1
let currentPage = 1;
let maxPage = 0; //maxPage policzę po pierwszym requescie

//wyłączam domyślnie buttony paginacji
[btnPrev, btnNext].forEach(el => el.disabled = true);

function loadData(q, page) {
    return fetch(`${api}?key=${apiKey}&q=${q}&orientation=horizontal&page=${page}&per_page=${imagesPerPage}`)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw Error(`Error in connection: ${res.status}`);
            }
        });
}

function loadImages(q, page) {
    btnPrev.disabled = currentPage > minPage ? false : true;
    btnNext.disabled = true;

    return loadData(q, page).then(res => {
        ul.innerHTML = "";

        //liczę maksymalną stronę
        if (res.totalHits) {
            maxPage = res.totalHits / imagesPerPage;
        }
        if (currentPage < maxPage) {
            btnNext.disabled = false;
        }

        res.hits.forEach(el => {
            const element = document.createElement("div");
            element.classList.add("gallery-element", "is-loading");

            element.innerHTML = `
                <a data-fslightbox="gallery" href="${el.largeImageURL}" title="photo id: ${el.id}" class="gallery-link">
                    <img src="${el.largeImageURL}" class="gallery-image" alt="photo id: ${el.id}">
                </a>
            `;

            element.querySelector("img").addEventListener("load", e => {
                element.classList.remove("is-loading");
            });

            ul.append(element);
        });

        //funkcja wzięta z dokumentacji lightbox
        //https://fslightbox.com/javascript/documentation/how-to-use#refreshing
        refreshFsLightbox();
    })
}

searchForm.addEventListener("submit", e => {
    e.preventDefault();

    const q = searchInput.value;
    loadImages(q, currentPage);
});

btnPrev.addEventListener("click", e => {
    currentPage--;
    currentPage = Math.max(currentPage, minPage);

    const q = searchInput.value;
    loadImages(q, currentPage);
});

btnNext.addEventListener("click", e => {
    currentPage++;

    const q = searchInput.value;
    loadImages(q, currentPage);
});