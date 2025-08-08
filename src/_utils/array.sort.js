//: ----------------------------------------------------------------------------
//: array.sort
//: ----------------------------------------------------------------------------
/*

Przykład użycia:

const array1 = [
  { key: 'b', value: 2 },
  { key: 'a', value: 1 },
  { key: 'c', value: 3 }
];
const array2 = [
  { key: 'x', value: 9 },
  { key: 'y', value: 10 }
];

const result = sortAndInsertByKey(array1, array2, 'b');
console.log(result);

Wynik:

[
  { key: 'a', value: 1 },
  { key: 'x', value: 9 },
  { key: 'y', value: 10 },
  { key: 'b', value: 2 },
  { key: 'c', value: 3 }
]

*/
//: ----------------------------------------------------------------------------
//: Przykład użycia modułu w pliku main.js
//: ----------------------------------------------------------------------------
/*

// Import funkcji z modułu
import { sortAndInsertBeforeKey, sortAndInsertAfterKey } from './arrayInsertModule.js';

const array1 = [
  { key: 'b', value: 2 },
  { key: 'a', value: 1 },
  { key: 'c', value: 3 }
];

const array2 = [
  { key: 'x', value: 9 },
  { key: 'y', value: 10 }
];

// Wstawianie przed kluczem 'b'
const resultBefore = sortAndInsertBeforeKey([...array1], array2, 'b');
console.log('Wstawianie przed kluczem "b":', resultBefore);

// Wstawianie po kluczu 'b'
const resultAfter = sortAndInsertAfterKey([...array1], array2, 'b');
console.log('Wstawianie po kluczu "b":', resultAfter);

*/

//: ----------------------------------------------------------------------------
// Funkcja sortuje array1 alfabetycznie po polu 'key'
// i wstawia elementy array2 przed element o kluczu keyToInsertBefore
//: export function sortAndInsertBeforeKey(array1, array2, keyToInsertBefore) {
//: ----------------------------------------------------------------------------
export function sortAndInsertByKey(array1, array2, keyToInsertBefore) {
  // 1. Sortujemy pierwszą tablicę alfabetycznie po polu 'key'
  array1.sort((a, b) => a.key.localeCompare(b.key));

  // 2. Znajdujemy indeks, przed którym wstawimy elementy z drugiej tablicy
  const insertIndex = array1.findIndex(obj => obj.key === keyToInsertBefore);

  if (insertIndex === -1) {
    // Jeśli nie znaleziono klucza, możemy np. dodać drugą tablicę na koniec
    array1.push(...array2);
  } else {
    // 3. Wstawiamy elementy z array2 w znalezione miejsce,
    // zaczynając od ostatniego, by nie zmieniać indeksów kolejnych wstawek
    for (let i = array2.length - 1; i >= 0; i--) {
      array1.splice(insertIndex, 0, array2[i]);
    }
  }

  return array1;
}

//: ----------------------------------------------------------------------------
// Funkcja sortuje array1 alfabetycznie po polu 'key'
// i wstawia elementy array2 po elemencie o kluczu keyToInsertAfter
//: ----------------------------------------------------------------------------
export function sortAndInsertAfterKey(array1, array2, keyToInsertAfter) {
  // 1. Sortowanie pierwszej tablicy po polu 'key'
  array1.sort((a, b) => a.key.localeCompare(b.key));

  // 2. Znajdź indeks elementu z kluczem, po którym chcemy wstawić
  const insertIndex = array1.findIndex(obj => obj.key === keyToInsertAfter);

  if (insertIndex === -1) {
    // Jeśli nie znaleziono klucza, dołóż elementy z array2 na koniec
    array1.push(...array2);
  } else {
    // 3. Wstaw elementy array2 po znalezionym indeksie
    // Wstawianie zaczynamy od najmniejszego indeksu, bo chcemy wstawić kolejno z przesunięciem
    for (let i = 0; i < array2.length; i++) {
      array1.splice(insertIndex + 1 + i, 0, array2[i]);
    }
  }

  return array1;
}
