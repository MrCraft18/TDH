const TDH = require('./lib.js')
const express = require('express')

app = express()

app.use(express.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})



app.get('/orders', async (req, res) => {
    try {
        const ordersArray = await TDH.getOrders()
        res.status(200).send(ordersArray)
        console.log('Sent All Orders to Client')
    } catch (err) {
        res.status(500).send('Internal TDH Server Error')
        console.log(err)
        console.log(`Failed to Respond With Orders Array`)
    }
})

app.get('/order', async (req, res) => {
    try {
        const serial = req.query.serial
        const order = await TDH.getOrder(serial)
        res.status(200).send(order)
        console.log('Sent Order to Client')
    } catch (err) {
        res.status(500).send('Internal TDH Server Error')
        console.log(err)
        console.log(`Failed to Respond With Order`)
    }
})



app.put('/editOrder', async (req, res) => {
    try {
        const editedOrder = req.body.orderJSON

        await TDH.updateOrder(editedOrder)

        res.status(200).send('Edited Order Successfully')
        console.log(`Edited Order: ${editedOrder.serial}`)
    } catch (err) {
        res.status(500).send('Internal TDH Server Error')
        console.log(err)
        console.log(`Failed to Edit Order`)
    }

})



const port = 5500
app.listen(port, () => {
    console.log('Express server running on ' + port)
})