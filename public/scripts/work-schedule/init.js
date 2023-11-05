let workers
let ordersArray

window.onload = function () {
   Promise.all([serverRequest('queryAllOrders'), serverRequest('queryWorkers')])
        .then(([ordersResponse, workersResponse]) => {
            if (!ordersResponse.ok || !workersResponse.ok) {
                throw new Error('Network response was not ok');
            } 
            
            const ordersArray = ordersResponse.body;
            const workers = workersResponse.body;
            const scheduleContainerDiv = document.querySelector('.schedule-container');

            workers.forEach(worker => {
                const workerDiv = document.createElement('div')
                workerDiv.classList.add('worker')
                workerDiv.id = worker
                workerDiv.innerHTML = `
                    <div class="name">${worker}</div>
                `

                scheduleContainerDiv.appendChild(workerDiv)
            })

            let today = new Date();
            let month = String(today.getMonth() + 1).padStart(2, '0');
            let day = String(today.getDate()).padStart(2, '0'); 
            let year = today.getFullYear();
            let date = month + '/' + day + '/' + year;

            document.querySelector('.current-date').innerText = date

            updateSchedule(ordersArray, date)
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}








async function updateSchedule(ordersArray, date) {
    const workerDivs = document.querySelectorAll('.worker')

    workerDivs.forEach(workerDiv => {
        oldSpans = workerDiv.querySelectorAll('span')

        oldSpans.forEach(span => {
            span.parentNode.removeChild(span)
        })

        ordersArray.forEach(order => {
            let createdHeader = false
            order.parts.forEach(part => {
                if (part.assignDate === date && part.assignee === workerDiv.id && part.partStatus !== 'Done') {
                    if (!createdHeader) {
                        const headerSpan = document.createElement('span')
                        headerSpan.classList.add('customer-header')

                        headerSpan.innerText = order.customer

                        workerDiv.appendChild(headerSpan)
                        
                        createdHeader = true
                    }
                    const todoSpan = document.createElement('span')
                    todoSpan.classList.add('todo')
    
                    todoSpan.innerText = part.name
    
                    workerDiv.appendChild(todoSpan)
                }
            })
        })
    })
}













function nextDay() {
    const dateString = document.querySelector('.current-date').innerText

    let [month, day, year] = dateString.split('/').map(Number);
    const currentDate = new Date(year, month - 1, day);  // JavaScript months are 0-based
    currentDate.setDate(currentDate.getDate() + 1);

    month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Adds leading zero if needed
    day = String(currentDate.getDate()).padStart(2, '0');  // Adds leading zero if needed
    year = currentDate.getFullYear();
    const newDateString = `${month}/${day}/${year}`;

    console.log(newDateString);
    document.querySelector('.current-date').innerText = newDateString

    updateSchedule(ordersArray, newDateString)
}



function previousDay() {
    const dateString = document.querySelector('.current-date').innerText

    let [month, day, year] = dateString.split('/').map(Number);
    const currentDate = new Date(year, month - 1, day);  // JavaScript months are 0-based
    currentDate.setDate(currentDate.getDate() - 1);

    month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Adds leading zero if needed
    day = String(currentDate.getDate()).padStart(2, '0');  // Adds leading zero if needed
    year = currentDate.getFullYear();
    const newDateString = `${month}/${day}/${year}`;

    console.log(newDateString);
    document.querySelector('.current-date').innerText = newDateString

    updateSchedule(ordersArray, newDateString)
}