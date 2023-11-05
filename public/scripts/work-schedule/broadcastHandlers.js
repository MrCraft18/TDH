socket.on('editOrderBroadcast', body => {
    try {
        response = serverRequest('queryAllOrders')
        if (!response.ok) {
            console.log('Query All Orders Response Not Ok')
        }

        ordersArray = response.body

        updateSchedule(ordersArray, document.querySelector('.current-date').innerText)
    } catch (err) {
        console.log(err)
        console.log(`Error Editing Order from Broadcast`)
        //location.reload(true)
    }
})



socket.on('rearrangeOrdersBroadcast', body => {
    try {
        const ordersArray = body

        updateSchedule(ordersArray, document.querySelector('.current-date').innerText)
    } catch (err) {
        console.log(err)
        console.log(`Error Upadating Schedule from Rearrange Broadcast`)
        //location.reload(true)
    }
})