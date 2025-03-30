/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
	if (size === 0) return '';
  if (size === undefined) return string;

  const stringParts = string.split('');
  const newArr = [];
  let counter = 0;

  for (let i = 0; i < stringParts.length; i++) {
    if (i === 0 || stringParts[i] !== stringParts[i - 1]) {
      counter = 0;
    }

    if (counter < size) {
      newArr.push(stringParts[i]);
      counter++;
    }
  }

  return newArr.join('');
}
