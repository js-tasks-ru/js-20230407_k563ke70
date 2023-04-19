/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const keys = path.split('.')
    
    return function getValue(object, current = 0) {
        const value = object[keys[current]]

        if (current === (keys.length - 1) || !value) {
            return value
        }

        return getValue(value, current + 1)
    }
}
