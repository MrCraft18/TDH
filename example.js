const fs = require('fs')





const getOrders = () => {
    return JSON.parse(fs.readFileSync('./database/Mock Orders Array.json'))
}

const orders = getOrders()

makeUpdatedOrder(orders, '804', null, 'status', 'In Progress')





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
                console.log('No part name')
                // Update a top-level property
                console.log(i)
                console.log(param)
                console.log(newValue)
                orders[i][param] = newValue
                return orders
            }
        }
    }
}