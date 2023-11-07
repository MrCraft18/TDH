const fs = require('fs')

const ORDERS_PATH = './database/orders.json'
const WORKERS_PATH = './database/workers.json'





const getOrders = () => {
        return JSON.parse(fs.readFileSync(ORDERS_PATH))
}



const getWorkers = () => {
    return JSON.parse(fs.readFileSync(WORKERS_PATH))
}



const getOrder = async (serial) => {
        const ordersArray = await getOrders()

        const order = ordersArray.find(order => {
            return(order.serial == serial)
        })

        return order
}



const updateOrder = async (order) => {
        const ordersArray = await getOrders()

        for(let i = 0; i < ordersArray.length; i++) {
            if(ordersArray[i].serial === order.serial) {
                ordersArray[i] = order
                break;
            }
        }

        fs.writeFileSync(ORDERS_PATH, JSON.stringify(ordersArray, null, 4), 'utf8')
}



const rearrangeOrders = (ordersArray) => {
        fs.writeFileSync(ORDERS_PATH, JSON.stringify(ordersArray, null, 4), 'utf8')
}


const addOrder = async (newOrder) => {
    const ordersArray = await getOrders()

    if (ordersArray.length == 0) {
        ordersArray.push(newOrder)

        fs.writeFileSync(ORDERS_PATH, JSON.stringify(ordersArray, null, 4))
    }

    let orderExists = false
    ordersArray.forEach(order => {
        if (orderExists) {
            return
        } else if ((order.serial == newOrder.serial)) {
            orderExists = true
        }
    });

    if (orderExists) {
        const oldOrder = ordersArray.find(order => {
            return(order.serial == newOrder.serial)
        })

        for (const prop in newOrder) {
            if (prop !== 'orderStatus' && prop !== 'parts') {
                oldOrder[prop] = newOrder[prop]
            }
        }

        oldOrder.parts = newOrder.parts.map((part, index) => {
            // Keep the properties of assignee, assignDate, and partStatus from targetObject
            const { assignee, assignDate, partStatus } = oldOrder.parts[index] || {};
            return {
                ...part,
                assignee,
                assignDate,
                partStatus
            };

        })

        ordersArray.forEach((order, index) => {
            if (order.serial == oldOrder.serial) {
                ordersArray[index] = oldOrder
            }

            // console.log(ordersArray)

            fs.writeFileSync(ORDERS_PATH, JSON.stringify(ordersArray, null, 4))

            return ordersArray
        }) 
    } else {
        const newOrderFinishDate = new Date(newOrder.dates.finishDate)

        for (i = ordersArray.length - 1; i >= 0; i--) {
            if (i == 0) {
                ordersArray.splice(0, 0, newOrder)
            }

            if (ordersArray[i].dates.finishDate === '') {
                continue
            }

            const existingFinishDate = new Date(ordersArray[i].dates.finishDate)

            if (existingFinishDate < newOrderFinishDate) {
                ordersArray.splice(i + 1, 0, newObject)
                break
            }
        }

        // console.log(ordersArray)

        fs.writeFileSync(ORDERS_PATH, JSON.stringify(ordersArray, null, 4))

        return ordersArray
    }
}









module.exports = {
    getOrders,
    getWorkers,
    getOrder,
    updateOrder,
    rearrangeOrders,
    addOrder,
}