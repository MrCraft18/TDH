const socket = io()



function convertDateToISOFormat(dateString) {
    const [month, day, year] = dateString.split('/');
  
    // Construct the ISO date string
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
    return isoDate;
}



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



  function convertDateToReadFormat(dateString) {
    // Parse the date parts
    const [year, month, day] = dateString.split('-');
  
    // Construct a new Date object using UTC time
    const date = new Date(Date.UTC(year, month - 1, day));
  
    // Format the date as MM/DD/YYYY
    return date.toLocaleDateString('en-US', {
      timeZone: 'UTC', // This ensures we ignore local timezone offsets
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }