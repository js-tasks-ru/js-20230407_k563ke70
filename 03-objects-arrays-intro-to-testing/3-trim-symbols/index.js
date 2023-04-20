/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    
    function getLetters(letter, index) {
        const range = index + size + 1
        const substring =  string.slice(index, range)
        const values = Array.from(new Set(substring))

        if (index >= (string.length - size)) {
            return letter
        }

        if (values.length === 1 && letter === values[0]) {
                return
        }

        return letter
    }
    
    return string
        .split('')
        .filter(getLetters)
        .join('')
}
