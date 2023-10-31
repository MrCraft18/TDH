let isDragging = false;
let currentOrder = null;
let offsetY = 0;
let initY = 0;
let dragTimer = null;

const orderList = document.querySelector("#orders");



const startDrag = (e) => {
    const order = e.target.closest(".order");
    if (order) {
        dragTimer = setTimeout(() => {
            isDragging = true;
            currentOrder = order;
            offsetY = currentOrder.offsetTop;
            currentOrder.classList.add("dragging");
            document.body.style.userSelect = "none";
            document.body.style.webkitUserSelect = "none";
            currentOrder.style.top = offsetY + "px";
            initY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
        }, 500)
    }
};
document.addEventListener("mousedown", startDrag, { passive: false });
document.addEventListener("touchstart", startDrag, { passive: false });



const moveDrag = (e) => {
    if (!isDragging) {
        clearTimeout(dragTimer)
    }
    if (isDragging && currentOrder) {
        if (e.type === 'touchmove') e.preventDefault();
        const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
        let newTop = clientY - (initY - offsetY);;
        if (newTop < 52) {
            newTop = 52;
        }

        currentOrder.style.top = newTop + "px";

        let orderSibilings = [...document.querySelectorAll(".order:not(.dragging)")];

        let nextOrder = orderSibilings.find((sibiling) => {
            return(clientY - document.body.getBoundingClientRect().top <= sibiling.offsetTop + sibiling.offsetHeight / 2);
        });

        orderSibilings.forEach((sibiling) => {
            sibiling.style.marginTop = "0px";
        });

        if (nextOrder) {
            nextOrder.style.marginTop = currentOrder.offsetHeight + 20 + "px";
        }
        orderList.insertBefore(currentOrder, nextOrder);
}};
document.addEventListener("mousemove", moveDrag, { passive: false });
document.addEventListener("touchmove", moveDrag, { passive: false });



const endDrag = async () => {
    clearTimeout(dragTimer);
    if (currentOrder) {
        currentOrder.classList.remove("dragging");
        currentOrder.style.top = "auto";
        currentOrder = null;
        isDragging = false;
        document.body.style.userSelect = "auto";

        const jsonElements = [...document.querySelectorAll('.json')]
        const ordersArray = []
    
        jsonElements.forEach(element => {
            ordersArray.push(JSON.parse(element.innerText))
        })
    
        const rearrangeOrdersResponse = await serverRequest('rearrangeOrders', ordersArray)
        if (rearrangeOrdersResponse.ok) {
            console.log(`Rearranged Orders Successfully`)
        } else {
            console.log(`Error Rearranging Orders. Reloading Page...`)
            location.reload(true)
        }
    }

    let orderSibilings = [
        ...document.querySelectorAll(".order:not(.dragging)"),
    ];

    orderSibilings.forEach((sibiling) => {
        sibiling.style.marginTop = "0px";
    });
};
document.addEventListener("mouseup", endDrag);
document.addEventListener("touchend", endDrag);