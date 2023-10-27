fs = require('fs')

const names = [
    "John Smith",
    "Jane Doe",
    "Michael Johnson",
    "Emily Taylor",
    "Robert Brown",
    "Mary Jones",
    "William Miller",
    "Sarah Davis",
    "James Wilson",
    "Jessica Taylor",
    "John Smith",
    "Jane Doe",
    "Michael Johnson",
    "Emily Taylor",
    "Robert Brown",
    "Mary Jones",
    "William Miller",
    "Sarah Davis",
    "James Wilson",
    "Jessica Taylor"
]



const ordersArray = []

names.forEach((name, index) => {
    const order = fs.readFileSync("./Order JSON Examples/Order Template.json", 'utf8')
    const orderJSON = JSON.parse(order)

    orderJSON.customer = name
    orderJSON.type = getRandomElement(orderJSON.type)
    orderJSON.bodyType = getRandomElement(orderJSON.bodyType)
    orderJSON.parts = orderJSON.parts.map(part => getRandomOptions(part))

    ordersArray.push(orderJSON)
})

fs.writeFileSync(`./Mock Orders Array.json`, JSON.stringify(ordersArray, null, 4))




function getRandomOptions(obj) {
    let result = Object.assign({}, obj);  // Copy all properties from obj to result
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let value = obj[key];
            if (Array.isArray(value) && value.length > 0) {
                let randomIndex = Math.floor(Math.random() * value.length);
                result[key] = value[randomIndex];
            }
        }
    }
    return result;
}



function getRandomElement(array) {
    if (Array.isArray(array) && array.length > 0) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }
}