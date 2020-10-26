Do rozwiązania użyłem zainstalowany globalnie https://parceljs.org (według ich instrukcji)

Żeby móc odpalać dwa zadania na raz w jednym terminalu, zainstalowałem paczkę https://stackoverflow.com/questions/30950032/how-can-i-run-multiple-npm-scripts-in-parallel#answer-38213212

Dodatkowo zmieniłem nazwy zadań, tak by `npm start` odpalał zarówno budowanie w parcelu, jak i json-server.

Kod css podzieliłem na oddzielne pliki w katalogu scss. Głównym plikiem jest style.scss, który importuję do pliku `js/app.js`.

Całością kompilacji zajmuje się parcel, który wykrywa dołączony do html odpowiedni plik js. Wynikowe pliki dostajemy w katalogu `dist`.