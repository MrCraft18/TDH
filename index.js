const { readFileSync } = require('fs');

fs = require('fs')

const list = fs.readdirSync("./Mock Order List")

list.sort((a, b) => {
    const numA = parseInt(a.split('_')[0], 10);
    const numB = parseInt(b.split('_')[0], 10);
    return numA - numB;
})



const orders = []
list.forEach(order => {
    const orderJSON = JSON.parse(readFileSync(`./Mock Order List/${order}`))

    orders.push(orderJSON)
})

console.log(JSON.stringify(orders, null, 4))