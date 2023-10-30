const TDH = require('./lib.js')
const express = require('express')
const socketIo = require('socket.io')

app = express()

app.use(express.json())
app.use(express.static('public'))

const port = 5500
const server = app.listen(port, () => {
    console.log('Express server running on ' + port)
})

const io = socketIo(server)



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})


io.on('connection', (socket) => {
    console.log('Client Connected')



    socket.on('queryAllOrders', async () => {
        try {
            const ordersArray = await TDH.getOrders()

            socket.emit('queryAllOrders', {
                ok: true,
                body: ordersArray
            })

            console.log('Sent All Orders')
        } catch (err) {
            console.log(err)
            console.log('Failed Send All Orders')
            socket.emit('queryAllOrders', {
                ok: false
            })
        }
    })



    socket.on('editOrder', async body => {
        try {
            const editedOrder = body
    
            await TDH.updateOrder(editedOrder)
    
            socket.emit('editOrder', {
                ok: true
            })

            console.log(`Edited Order: ${editedOrder.serial}`)
        } catch (err) {
            socket.emit('editOrder', {
                ok: false
            })
            console.log(err)
            console.log(`Failed to Edit Order`)
        }
    })
})