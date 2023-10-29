let ordersArray = []
let orderStatusOptions = ['Not Started', 'In Progress', 'Waiting', 'Finished']
let partStatusOptions = ['Unfinished', 'Done']
let workerOptions = ['Dakota', 'Caden', 'Jeff', 'Orion', 'Jason', 'Unassigned Worker']



window.onload = async function () {
    try {
        const response = await fetch('../Mock Orders Array.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        ordersArray = await response.json();

        const ordersDiv = document.getElementById('orders');

        ordersArray.forEach((order, index) => {
            const orderDiv = document.createElement('div');
            const orderInfoDiv = document.createElement('div');
            const partsDiv = document.createElement('div');
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
                            <td class="order-data">${order.customer}</td>
                            <td class="order-data">${order.type}</td>
                            <td class="order-data">${order.bodyType}</td>
                            <td class="order-data">Due Date:<br>${order.dates.finishDate}</td>
                            <td class="order-data">
                                <select class="custom-select">
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
                            <td class="part-data">${part.name}</td>
                            <td class="part-data">
                                <select class="custom-select">
                                    ${workerOptions.map(opt => `
                                        <option${opt === part.assignee ? ' selected' : ''}>${opt}</option>
                                    `)}
                                </select>    
                            </td>
                            <td class="part-data">
                                <input type="date" value="${part.assignDate === '' ? '' : part.assignDate.replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2")}">  
                            </td>
                            <td class="part-data">
                                <select class="custom-select">
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
        console.error('There has been a problem with your fetch operation:', error);
    }

    //Remove Selector Border after option selected and stop propagation
    const selectElements = document.querySelectorAll('.custom-select');
    const dateElements = document.querySelectorAll('input[type="date"]')
    const inputElements = [...selectElements, ...dateElements]
    inputElements.forEach(function(inputElement) {
    inputElement.addEventListener('change', function() {
        this.blur();

        let orderJSON

        const partsElement = this.closest('.parts')
        const orderInfoElement = this.closest('.order-info')
        if (partsElement) {
            orderJSON= partsElement.parentNode.querySelector('.json').innerText
        } else if (orderInfoElement) {
            orderJSON = orderInfoElement.parentNode.querySelector('.json').innerText
        }

        console.log(orderJSON)

    });
    inputElement.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});
}