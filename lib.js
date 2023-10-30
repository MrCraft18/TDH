const fs = require('fs')





const getOrders = () => {
    return new Promise(res => {
        res(JSON.parse(fs.readFileSync('./database/Mock Orders Array.json')))
    })
}



const getOrder = (serial) => {
    return new Promise(async res => {
        const ordersArray = await getOrders()

        const order = ordersArray.find(order => {
            return(order.serial == serial)
        })

        res(order)
    })
}



const updateOrder = (order) => {
    return new Promise(async res => {
        const ordersArray = await getOrders()

        for(let i = 0; i < ordersArray.length; i++) {
            if(ordersArray[i].serial === order.serial) {
                ordersArray[i] = order
                break;
            }
        }

        fs.writeFileSync('./database/Mock Orders Array.json', JSON.stringify(ordersArray, null, 4), 'utf8')
        res()
    })
}










module.exports = {
    getOrders,
    getOrder,
    updateOrder,
}