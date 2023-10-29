const TDH = require('./lib.js')
const express = require('express')

app = express()

app.use(express.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})



app.get('/orders', async (req, res) => {
    const ordersArray = await TDH.getOrders()
    res.send(ordersArray)
    console.log('Sent Orders to Client')
})



app.put('/editOrder', async (req, res) => {
    try {
        const serial = req.body.serial
        const partName = req.body.partName
        const parameter = req.body.parameter
        const value = req.body.value
    
        let ordersArray = await TDH.getOrders()

        ordersArray = TDH.makeUpdatedOrder(ordersArray, serial, partName, parameter, value)

        await TDH.updateOrders(ordersArray)

        res.send({ "ok": true })
        console.log(`Edited Order: ${serial} "${parameter}" to => ${value}`)
    } catch (err) {
        res.send({ "ok": false })
        console.log(err)
        console.log(`Failed to Edit Order`)
    }

})



const port = 5500
app.listen(port, () => {
    console.log('Express server running on ' + port)
})