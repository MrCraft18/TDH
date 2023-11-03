const socket = io()



socket.on('editOrderBroadcast', body => {
    try {
        const editedOrder = body.order

        const jsonElements = [...document.querySelectorAll('.json')]
        const jsonElement = jsonElements.find(element => {
            const orderJSON = JSON.parse(element.innerText)
            return (orderJSON.serial == editedOrder.serial) 
        })

        //BRUUUUUUUUUUUUUUUUUUUUUUUUH

        const orderDiv = jsonElement.closest('.order')
        const selectElements = orderDiv.querySelectorAll('.custom-select');
        const dateElements = orderDiv.querySelectorAll('input[type="date"]')
        const inputElements = [...selectElements, ...dateElements]

        inputElements.forEach(element => {
            const parameter = convertCase(getParameter(element.classList), "camel")

            if (element.closest('.parts')) {
                const partName = element.closest('tr').querySelector('.part-name').innerText

                for (i = 0; i < editedOrder.parts.length; i++) {
                    if (editedOrder.parts[i].name === partName) {
                        if (editedOrder.parts[i][parameter]) {
                            element.value = editedOrder.parts[i][parameter]
                        }
                        break
                    }
                }
            } else {
                element.value = editedOrder[parameter]
            }
        })
    } catch (err) {
        console.log(err)
        console.log(`Error Editing Order from Broadcast`)
        //location.reload(true)
    }
})



socket.on('rearrangeOrdersBroadcast', body => {
    try {
        const newOrdersArrangement = body

        const ordersDiv = document.getElementById('orders')
    
        newOrdersArrangement.forEach((order, index) => {
            const orderDiv = document.getElementById(order.serial)
            ordersDiv.appendChild(orderDiv)
        })
    } catch (err) {
        console.log(err)
        console.log(`Error Rearranging Orders from Broadcast`)
        //location.reload(true)
    }
})