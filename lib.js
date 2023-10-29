const fs = require('fs')





const getOrders = () => {
    return new Promise(res => {
        res(JSON.parse(fs.readFileSync('./database/Mock Orders Array.json')))
    })
}

const updateOrders = (orders) => {
    return new Promise(res => {
        fs.writeFileSync('./database/Mock Orders Array.json', JSON.stringify(orders, null, 4), 'utf8')
        res()
    })
}



function makeUpdatedOrder(orders, serial, partName = null, param, newValue) {
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].serial == serial) {
            console.log('Found Order with serial')
            if (partName) {
                // Update a property within the parts array
                for (let j = 0; j < orders[i].parts.length; j++) {
                    if (orders[i].parts[j].name === partName) {
                        orders[i].parts[j][param] = newValue
                        return orders
                    }
                }
            } else {
                // Update a top-level property
                orders[i][param] = newValue
                return orders
            }
        }
    }
}










module.exports = {
    getOrders,
    makeUpdatedOrder,
    updateOrders,
}