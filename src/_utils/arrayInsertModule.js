/*
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

console.log('--- sortAndInsertByKey (wstawianie przed kluczem "b") ---');
const resultBefore = sortAndInsertByKey(array1, array2, 'b', false);
console.log(resultBefore);

console.log('--- sortAndInsertByKey (wstawianie po kluczu "b") ---');
const resultAfter = sortAndInsertByKey(array1, array2, 'b', true);
console.log(resultAfter);

console.log('--- sortByPredefinedKeys (appendMissing = true) ---');
const order = ['a', 'b', 'c'];
const sortedAppend = sortByPredefinedKeys(array1, order, 'key', true);
console.log(sortedAppend);

console.log('--- sortByPredefinedKeys (appendMissing = false) ---');
const sortedIgnore = sortByPredefinedKeys(array1, order, 'key', false);
console.log(sortedIgnore);

// Oryginalne tablice pozostają bez zmian
console.log('Oryginalne array1:', array1);
console.log('Oryginalne array2:', array2);
*/

/**
 * Funkcja sortuje tablicę alfabetycznie po polu 'key' i wstawia elementy array2
 * przed lub po elemencie o określonym kluczu `keyToInsertAt`.
 * Nie modyfikuje oryginalnej tablicy.
 *
 * @param {Array} array1 - Pierwsza tablica z obiektami.
 * @param {Array} array2 - Druga tablica, elementy do wstawienia.
 * @param {string} keyToInsertAt - Klucz, przed/po którym nastąpi wstawienie.
 * @param {boolean} insertAfter - true = wstaw po elemencie, false = przed (domyślnie false).
 * @returns {Array} Nowa tablica z wstawionymi elementami.
 */
export function sortAndInsertByKey(array1, array2, keyToInsertAt, insertAfter = false) {
  const sortedArray = typeof array1.toSorted === 'function'
    ? array1.toSorted((a, b) => a.key.localeCompare(b.key))
    : array1.slice().sort((a, b) => a.key.localeCompare(b.key));

  const index = sortedArray.findIndex(obj => obj.key === keyToInsertAt);

  if (index === -1) {
    // Klucz nie znaleziony, doklejamy array2 na końcu
    return [...sortedArray, ...array2];
  }

  if (insertAfter) {
    return [
      ...sortedArray.slice(0, index + 1),
      ...array2,
      ...sortedArray.slice(index + 1)
    ];
  } else {
    return [
      ...sortedArray.slice(0, index),
      ...array2,
      ...sortedArray.slice(index)
    ];
  }
}

/**
 * Funkcja sortuje tablicę wg predefiniowanej listy kluczy.
 * Zwraca nową tablicę, oryginał pozostaje bez zmian.
 *
 * @param {Array} array - Tablica do posortowania.
 * @param {Array} orderList - Lista kluczy określająca kolejność.
 * @param {string} keyName - Nazwa klucza, domyślnie 'key'.
 * @param {boolean} appendMissing - true: elementy spoza listy na koniec, false: ignoruj je.
 * @returns {Array} Posortowana tablica.
 */
export function sortByPredefinedKeys(array, orderList, keyName = 'key', appendMissing = true) {
  const orderMap = new Map(orderList.map((key, index) => [key, index]));

  return array
    .filter(item => appendMissing || orderMap.has(item[keyName]))
    .slice() // kopia tablicy, oryginał bez zmian
    .sort((a, b) => {
      const indexA = orderMap.has(a[keyName]) ? orderMap.get(a[keyName]) : (appendMissing ? Infinity : -1);
      const indexB = orderMap.has(b[keyName]) ? orderMap.get(b[keyName]) : (appendMissing ? Infinity : -1);

      if (indexA === indexB) return 0;
      return indexA < indexB ? -1 : 1;
    });
}
