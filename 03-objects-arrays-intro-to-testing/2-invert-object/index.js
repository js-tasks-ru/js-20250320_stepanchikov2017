/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
	if(!obj) return undefined;

	let objCopy = obj
  
  Object.fromEntries(
    Object.entries(obj).filter(item => {
      delete objCopy[item[0]];
      objCopy[item[1]] = item[0];
    })
  )

	return objCopy;
}
