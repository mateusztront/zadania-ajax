const form = document.querySelector("form");
const apiUrl = 'https://www.googleapis.com/books/v1/volumes';
const input = form.querySelector("input");

form.addEventListener("submit", function(e) {
    e.preventDefault();
    if (input.value !== "") {
        fetch(apiUrl + `?q=${input.value}`)
            .then(res => res.json())
            .then(res => {
                //debugger;
                for (const el of res.items) {
                    console.log(el.volumeInfo.title)
                }
                input.value = "";
            })
    }
})

//xmlhttprequest
// form.addEventListener("submit", function(e) {
//     e.preventDefault();
//     if (input.value !== "") {
//         const xml = new XMLHttpRequest();
//         xml.open("get", apiUrl + `?q=${input.value}`)
//         xml.onload = function() {
//             const res = JSON.parse(xml.responseText);
//             debugger;
//             for (const el of res.items) {
//                 console.log(el.volumeInfo.title)
//             }
//             input.value = "";
//         }
//         xml.send(null);
//     }
// })

//axios
// form.addEventListener("submit", function(e) {
//     e.preventDefault();
//     if (input.value !== "") {
//         axios.get(apiUrl + `?q=${input.value}`)
//             .then(res => {
//                 //debugger;
//                 for (const el of res.data.items) {
//                     console.log(el.volumeInfo.title)
//                 }
//                 input.value = "";
//             })
//     }
// })