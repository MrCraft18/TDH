socket.on('editOrderBroadcast', body => {
    try {
        const order = body.order

        const jsonElements = [...document.querySelectorAll('.json')]
        const jsonElement = jsonElements.find(element => {
            const orderJSON = JSON.parse(element.innerText)
            return (orderJSON.serial == order.serial) 
        })

        const orderDiv = jsonElement.closest('.order')
        const selectElements = orderDiv.querySelectorAll('.custom-select');
        const dateElements = orderDiv.querySelectorAll('input[type="date"]')
        const inputElements = [...selectElements, ...dateElements]

        inputElements.forEach(element => {
            const parameter = convertCase(getParameter(element.classList), camel)

            if (element.closest('.parts')) {

            } else {
                element.value = order[parameter]
            }
        })
    } catch (err) {
        console.log(err)
        console.log(`Error Editing Order from Broadcast`)
        // location.reload(true)
    }
})