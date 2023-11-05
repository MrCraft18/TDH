socket.on('editOrderBroadcast', async body => {
    try {
        serverRequest('queryAllOrders')
            .then(response => {
                if (response.ok) {
                    ordersArray = response.body

                    updateSchedule(ordersArray, document.querySelector('.current-date').innerText)
                } else {
                    console.log("Query All Orders Response is Not Ok")
                }
            })
            .catch(err => {
                console.log(err)
            })
    } catch (err) {
        console.log(err)
        console.log(`Error Editing Order from Broadcast`)
        //location.reload(true)
    }
})