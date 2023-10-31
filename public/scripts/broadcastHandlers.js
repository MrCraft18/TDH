socket.on('editOrderBroadcast', body => {
    try {
        const jsonElements = [...document.querySelectorAll('.json')]
        const jsonElement = jsonElements.find(element => {
            const orderJSON = JSON.parse(element.innerText)
            return (orderJSON.serial == body.order.serial) 
        })

        const orderElement = jsonElement.closest('.order')
        const changedParameter = convertCase(body.changedParameter, 'kebab')

        if (changedParameter === 'order-status') {
            const changedElement = orderElement.querySelector('.order-status')
        }
    } catch (err) {
        console.log(err)
        console.log(`Error Editing Order from Broadcast`)
        // location.reload(true)
    }
})