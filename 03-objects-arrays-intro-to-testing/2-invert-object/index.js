/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
	if(!obj) return;

	const objCopy = {};
  
  Object.fromEntries(
    Object.entries(obj).filter(item => {
      objCopy[item[1]] = item[0];
    })
  )

	return objCopy;
}
