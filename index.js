const TDH = require('./libs/lib.js')
const excel = require('./libs/excelLib.js')
const express = require('express')
const socketIo = require('socket.io')

app = express()

app.use(express.json())
app.use(express.static('public'))

const port = process.env.PORT || 5500
const server = app.listen(port, () => {
    console.log('Express server running on ' + port)
})

const io = socketIo(server)



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/order-list.html')
})


io.on('connection', (socket) => {
    console.log('Client Connected')



    socket.on('queryAllOrders', async (body, res) => {
        try {
            const ordersArray = await TDH.getOrders()

            res({
                ok: true,
                body: ordersArray
            })

            console.log('Sent All Orders')
        } catch (err) {
            console.log(err)
            console.log('Failed to Send All Orders')
            res({
                ok: false
            })
        }
    })



    socket.on('queryWorkers', async (body, res) => {
        try {
            const workersArray = await TDH.getWorkers()

            res({
                ok: true,
                body: workersArray
            })

            console.log('Sent Workers')
        } catch (err) {
            console.log(err)
            console.log('Failed to Send Workers')
            res({
                ok: false
            })
        }
    })



    socket.on('editOrder', async (body, res) => {
        try {
            const editedOrder = body.order
    
            await TDH.updateOrder(editedOrder)
    
            res({
                ok: true
            })

            console.log(`Edited Order: ${editedOrder.serial}`)

            socket.broadcast.emit('editOrderBroadcast', {order: editedOrder, changedParameter: body.changedParameter})

            console.log('Broadcasted Edit')
        } catch (err) {
            res({
                ok: false
            })
            console.log(err)
            console.log(`Failed to Edit Order`)
        }
    })



    socket.on('rearrangeOrders', async (body, res) => {
        try {
            const oldOrdersArrangement = await TDH.getOrders()
            const newOrdersArrangement = body

            if (JSON.stringify(oldOrdersArrangement) !== JSON.stringify(newOrdersArrangement)) {
                TDH.rearrangeOrders(newOrdersArrangement)

                console.log('Rearranged Orders Successfully')

                socket.broadcast.emit('rearrangeOrdersBroadcast', newOrdersArrangement)
    
                console.log('Broadcasted Rearranged Orders')
            } else {
                console.log("Didn't Need to Rearrange Orders")
            }

            res({
                ok: true
            })
        } catch (err) {
            res({
                ok: false
            })
            console.log(err)
            console.log(`Failed to Rearrange Orders`)
        }
    })



    socket.on('excelUpload', async (body, res) => {
        try {
            const fileName = body.fileName
            const fileData = body.fileData
            const date = body.date
    
            console.log(`Received File: ${fileName} With Upload Date: ${date}`)
    
            let orderJSON;
            try {
                orderJSON = await excel.parseOrder(fileData, date);
            } catch (e) {
                console.log(e)
                err = JSON.parse(e.message)
                // If parseOrder throws an error, it will be caught here
                if (err.userError) {
                    // Handle userError specifically
                    res({
                        ok: false,
                        ...err
                    });
                    return; // Ensure no further execution in this try block
                } else {
                    // If it's not a userError, throw the error again to be caught by the outer catch
                    throw err;
                }
            }
    
            // If no error occurred, continue processing
            ordersArray = await TDH.addOrder(orderJSON);
    
            res({
                ok: true
            });
        } catch (err) {
            // Any other error that is not a userError will be handled here
            res({
                ok: false
            });
            console.error(err); // Use console.error for better logging of errors
            console.log(`Failed to do something with excel file`);
        }
    });
})