let ordersArray = []
let orderStatusOptions = ['Not Started', 'In Progress', 'Waiting', 'Finished']
let partStatusOptions = ['Unfinished', 'Done']
let workerOptions = ['Dakota', 'Caden', 'Jeff', 'Orion', 'Jason', 'Unassigned Worker']

const URL = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`

const socket = io()

window.onload = async function () {
    try {
        const ordersResponse = await serverRequest('queryAllOrders')
        if (!ordersResponse.ok) {
            throw new Error('Network response was not ok ' + ordersResponse.statusText)
        }
        ordersArray = await ordersResponse.body

        const ordersDiv = document.getElementById('orders')

        ordersArray.forEach((order) => {
            const orderDiv = document.createElement('div')
            const orderInfoDiv = document.createElement('div')
            const partsDiv = document.createElement('div')
            const jsonDiv = document.createElement('div')

            orderDiv.id = order.serial
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
                                        <option${opt === order.orderStatus ? ' selected' : ''}>${opt}</option>
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
                                <select class="custom-select assignee">
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
                                        <option${opt === part.partStatus ? ' selected' : ''}>${opt}</option>
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
    inputElement.addEventListener('change', async function(event) {
        const element = event.target

        //Blur Element
        element.blur();


        //Stop Click Event Propagation
        inputElement.addEventListener('click', function(event) {
            event.stopPropagation();
        });



        //Make Change Request to Server
        const jsonDiv = element.closest('.order').querySelector('.json')
        let orderJSON = JSON.parse(jsonDiv.innerText)

        const parameter = getParameter(element.classList)
        const partName = getPartName(parameter, element)
        const value = element.value

        if (parameter === 'order-status') {
            orderJSON.orderStatus = value
        } else if (partName) {
            for (i = 0; i < orderJSON.parts.length; i++) {
                if (orderJSON.parts[i].name === partName) {
                    orderJSON.parts[i][convertCase(parameter, 'camel')] = value
                    break
                }
            }
        }


        //Send Edit Parameters to Server
        const editOrderResponse = await serverRequest('editOrder', {order: orderJSON, changedParameter: parameter})
        if (editOrderResponse.ok) {
            jsonDiv.innerText = JSON.stringify(orderJSON)
            console.log(`Edited ${orderJSON.customer} Order Successfully`)
        } else {
            console.log(`Error Editing ${orderJSON.customer} Order`)
        }
    });
});
}