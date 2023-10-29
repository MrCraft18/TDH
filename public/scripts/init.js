let ordersArray = []
let orderStatusOptions = ['Not Started', 'In Progress', 'Waiting', 'Finished']
let partStatusOptions = ['Unfinished', 'Done']
let workerOptions = ['Dakota', 'Caden', 'Jeff', 'Orion', 'Jason', 'Unassigned Worker']
let editableParameters = [{ 'order-status': 'status' }, { 'assignee': 'assignee' }, { 'assign-date': 'assignDate' }, { 'part-status': 'status' }]

const URL = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`

window.onload = async function () {
    try {
        const response = await fetch(URL + '/orders')
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText)
        }
        ordersArray = await response.json()

        const ordersDiv = document.getElementById('orders')

        ordersArray.forEach((order, index) => {
            const orderDiv = document.createElement('div')
            const orderInfoDiv = document.createElement('div')
            const partsDiv = document.createElement('div')
            const jsonDiv = document.createElement('div')

            jsonDiv.innerText = JSON.stringify(order)

            orderInfoDiv.classList.add('order-info');
            partsDiv.classList.add('parts');
            orderDiv.classList.add('order')
            jsonDiv.classList.add('json')

            //Add Event Listener for parts list dropdown
            orderInfoDiv.addEventListener('click', function (event) {
                event.stopPropagation()
                var content = this.nextElementSibling
                if (content.style.maxHeight) {
                    content.style.maxHeight = null
                } else {
                    content.style.maxHeight = content.scrollHeight + "px"
                }
            });



            orderInfoDiv.innerHTML = `
                <table>
                    <tbody class="order-body">
                        <tr>
                            <td class="order-data customer">${order.customer}</td>
                            <td class="order-data type">${order.type}</td>
                            <td class="order-data body">${order.bodyType}</td>
                            <td class="order-data due-date">Due Date:<br>${order.dates.finishDate}</td>
                            <td class="order-data order-status">
                                <select class="custom-select order-status">
                                    ${orderStatusOptions.map(opt => `
                                        <option${opt === order.status ? ' selected' : ''}>${opt}</option>
                                    `).join('')}
                                </select>    
                            </td>
                        </tr>
                    </tbody>
                </table>
            `;

            partsDiv.innerHTML = `
                <table>
                    <tbody>
                        ${order.parts.map(part => `
                        <tr>
                            <td class="part-data part-name">${part.name}</td>
                            <td class="part-data assignee">
                                <select class="custom-select asignee">
                                    ${workerOptions.map(opt => `
                                        <option${opt === part.assignee ? ' selected' : ''}>${opt}</option>
                                    `)}
                                </select>    
                            </td>
                            <td class="part-data assign-date">
                                <input class="assign-date" type="date" value="${part.assignDate === '' ? '' : part.assignDate}">  
                            </td>
                            <td class="part-data part-status">
                                <select class="custom-select part-status">
                                    ${partStatusOptions.map(opt => `
                                        <option${opt === order.status ? ' selected' : ''}>${opt}</option>
                                    `).join('')}
                                </select>
                            </td>
                        </tr>
                        `).join('')}
                    </tbody>    
                </table>
            `;

            orderDiv.appendChild(jsonDiv)
            orderDiv.appendChild(orderInfoDiv);
            orderDiv.appendChild(partsDiv)
            ordersDiv.appendChild(orderDiv)
        });
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error)
    }











    //Input Elements Event Listeners
    const selectElements = document.querySelectorAll('.custom-select');
    const dateElements = document.querySelectorAll('input[type="date"]')
    const inputElements = [...selectElements, ...dateElements]
    inputElements.forEach(function(inputElement) {
    inputElement.addEventListener('change', function(event) {
        //Blur Element
        this.blur();



        //Make Change Request to Server

        let orderJSON = this.closest('.order').querySelector('.json').innerText
        let inputLocation

        // const partsElement = this.closest('.parts')
        // const orderInfoElement = this.closest('.order-info')
        // if (partsElement) {
        //     orderJSON = partsElement.parentNode.querySelector('.json').innerText
        //     inputLocation = 'parts'
        // } else if (orderInfoElement) {
        //     orderJSON = orderInfoElement.parentNode.querySelector('.json').innerText
        //     inputLocation = 'order'
        // }

        console.log(orderJSON.serial)

        const serial = orderJSON.serial
        const parameter = getParameter(this.classList)
        console.log(parameter)
        const partName = getPartName(parameter, this)
        const value = this.value



        fetch('http://localhost:5500/editOrder', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                serial,
                partName,
                parameter,
                value,
            })
        })


    });



    //Stop Click Event Propagation
    inputElement.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});
}










function getParameter(classList) {
    const classesArray = [...classList]
    console.log(classesArray)
    
    for (let obj of editableParameters) {
        for (let key of classesArray) {
            if (obj.hasOwnProperty(key)) {
                return obj[key]
            }
        }
    }
}