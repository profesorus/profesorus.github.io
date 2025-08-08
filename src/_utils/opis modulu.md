<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>
---
# Dokumentacja modułu `arrayInsertModule.js`

Moduł udostępnia dwie funkcje do pracy z tablicami obiektów:

- `sortAndInsertByKey` — sortuje tablicę alfabetycznie po polu `key` i wstawia elementy z innej tablicy przed lub po elemencie o wskazanym kluczu.
- `sortByPredefinedKeys` — sortuje tablicę wg predefiniowanej listy kluczy z opcją dopisania lub pominięcia elementów spoza listy.


## Funkcja: `sortAndInsertByKey`

```js
sortAndInsertByKey(array1, array2, keyToInsertAt, insertAfter = false)
```

- **Opis:**
Sortuje tablicę `array1` po kluczu `'key'` (alfabetycznie), a następnie wstawia wszystkie elementy `array2` przed lub po elemencie o kluczu `keyToInsertAt`.
Jeśli element o podanym kluczu nie istnieje, elementy z `array2` zostaną dołożone na koniec.
- **Parametry:**
    - `array1` (Array): Tablica obiektów do posortowania i modyfikacji (oryginał nie jest modyfikowany).
    - `array2` (Array): Tablica obiektów do wstawienia.
    - `keyToInsertAt` (string): Wartość klucza referencyjnego.
    - `insertAfter` (boolean, domyślnie `false`): Jeśli `true`, wstawia elementy po elemencie o `keyToInsertAt`, w przeciwnym razie przed.
- **Zwraca:**
Nową tablicę z posortowanymi i zmodyfikowanymi elementami.


## Funkcja: `sortByPredefinedKeys`

```js
sortByPredefinedKeys(array, orderList, keyName = 'key', appendMissing = true)
```

- **Opis:**
Sortuje tablicę `array` według kolejności kluczy podanych w `orderList`.
Elementy, których wartość klucza `keyName` nie występuje na liście, mogą być dopisane na końcu (`appendMissing = true`) lub pominięte (`appendMissing = false`).
- **Parametry:**
    - `array` (Array): Tablica obiektów do posortowania.
    - `orderList` (Array<string>): Lista kluczy definiująca kolejność sortowania.
    - `keyName` (string, domyślnie `'key'`): Nazwa klucza w obiektach, po którym dokonujemy sortowania.
    - `appendMissing` (boolean, domyślnie `true`): Kontroluje, czy elementy spoza listy mają być dopisane na końcu (`true`) czy ignorowane (`false`).
- **Zwraca:**
Nową posortowaną tablicę.


## Przykład użycia modułu w `main.js`

```js
import { sortAndInsertByKey, sortByPredefinedKeys } from './arrayInsertModule.js';

const array1 = [
  { key: 'b', value: 2 },
  { key: 'a', value: 1 },
  { key: 'c', value: 3 },
  { key: 'z', value: 99 }
];

const array2 = [
  { key: 'x', value: 9 },
  { key: 'y', value: 10 }
];

// Wstawianie elementów array2 przed elementem o kluczu 'b'
const resultBefore = sortAndInsertByKey(array1, array2, 'b', false);
console.log('Wstawianie przed "b":', resultBefore);

// Wstawianie elementów array2 po elemencie o kluczu 'b'
const resultAfter = sortAndInsertByKey(array1, array2, 'b', true);
console.log('Wstawianie po "b":', resultAfter);

// Sortowanie według zdefiniowanej kolejności z dopisaniem elementów spoza listy
const order = ['a', 'b', 'c'];
const sortedAppend = sortByPredefinedKeys(array1, order, 'key', true);
console.log('Sortowanie z dopisaniem na koniec:', sortedAppend);

// Sortowanie z ignorowaniem elementów spoza listy
const sortedIgnore = sortByPredefinedKeys(array1, order, 'key', false);
console.log('Sortowanie z ignorowaniem:', sortedIgnore);

// Oryginalne tablice pozostają bez zmian
console.log('Oryginalne array1:', array1);
console.log('Oryginalne array2:', array2);
```

EOF

---
Jeśli chcesz, mogę też przesłać Ci ten dokument w postaci pliku `.md` do pobrania, albo pomóc z konwersją lub innymi formatami.

W razie potrzeby mogę też doradzić, jak zapisać i obsługiwać taki plik w popularnych edytorach lub jak wygodnie kopiować Markdown z różnych narzędzi.

Daj znać, jeśli chcesz, abym coś jeszcze doprecyzował!
