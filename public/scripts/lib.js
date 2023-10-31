function serverRequest (endpoint, body = null) {
    return new Promise((resolve, reject) => {
        try {
            socket.emit(endpoint, body, response => {
                resolve(response)
            })
        } catch (err) {
            reject(err)
        }
    })
}



function getParameter(classList) {
    const classesArray = [...classList]
    return classesArray[classesArray.length - 1]
}



function getPartName(parameter, element) {
    if (parameter === 'order-status') {
        return null
    } else {
        return element.closest('tr').querySelector('.part-name').innerText
    }
}



function convertCase(str, toCase) {
    const isKebab = str.includes('-');
    const isCamel = /[a-z][A-Z]/.test(str);
    
    if (toCase === 'camel') {
        if (isCamel) return str; // Already in camelCase
        return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    } else if (toCase === 'kebab') {
        if (isKebab) return str; // Already in kebab-case
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    } else {
        return 'Invalid case type';
    }
}