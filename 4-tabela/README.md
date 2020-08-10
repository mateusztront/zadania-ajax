# Zadania - ajax tabela

Do tego zadania będziemy potrzebowali bazy danych. Wykorzystamy tutaj [json-server](http://kursjs.pl/kurs/ajax/server-lokalny.php#json-server).

Wpierw zainstaluj wszystkie paczki poleceniem <strong>npm i</strong>. Następnie odpal skrypt <strong>npm start</strong>. Powinien się odpalić json-server wraz z obserwowaniem pliku z katalogu data/data.json, a w terminalu pojawić adres na który będziemy się łączyć np. http://localhost:3000/users

### Zadanie 1
Gdy otworzysz stronę z tego zadania w przeglądarce, twoim oczom ukaże się widok formularza filtrów oraz tabeli.

Zadanie będzie polegało na oprogramowaniu tabeli i formularza (późniejszy krok).

Tabela powinna wyświetlać dane, mieć możliwość sortowania po danej kolumnie (służyć do tego będą strzałeczki w nazwie kolumny) oraz mieć stronicowanie. Stronicowanie powinno być aktywne lub nieaktywne w zależności od tego czy serwer zwróci informację o tym czy istnieje kolejna/poprzednia strona do wyświetlenia.

Przy rozwiązywaniu zadania z pewnością przyda się spojrzeć na dokumentację json-server, na której opisane jest kilka niezbędnych dla nas rzeczy:

* https://github.com/typicode/json-server#paginate
* https://github.com/typicode/json-server#filter
* https://github.com/typicode/json-server#operators

Polecam wykonać przykładowe połączenie pobierające dane. Możesz do tego celu użyć dowolnego narzędzia (np. z wnętrza webstorm, czy za pomocą Postmana). Spróbuj połączyć się na przykładowy adres:
http://localhost:3000/users?_page=1&_limit=10
Przejrzyj w debugerze dokładnie zwrócone dane - zwłaszcza nagłówki. Wśród nich pojawi się specyficzny nagłówek link. Przyda się przy tworzeniu stronicowania.

Do tego zadania załączyłem plik rozwiązanie.md, w którym zamieściłem przykładowe rozwiązanie. Nie jest ono idealne, ponieważ bazuje na kodzie w jednym pliku. Gdybyś chciał podzielić kod na oddzielne pliki, lepiej było by wykorzystać wzorzec pubsub.