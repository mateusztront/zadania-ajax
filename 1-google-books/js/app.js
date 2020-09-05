document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector(".search-form");
    const input = document.querySelector("#search");

    form.addEventListener("submit", e => {
        e.preventDefault();

        fetch(`https://www.googleapis.com/books/v1/volumes?q=${input.value}`)
            .then(res => res.json())
            .then(res => {
                for (let el of res.items) {
                    console.log(el.volumeInfo.title);
                    console.log(el.volumeInfo.description);
                    console.log('');
                }
            })
    })

});
