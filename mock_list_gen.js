fs = require('fs')

const names = [
    "John Smith",
    "Jane Doe",
    "Michael Johnson",
    "Emily Taylor",
    "Robert Brown",
    "Mary Jones",
    "William Miller",
    "Sarah Davis",
    "James Wilson",
    "Jessica Taylor"
]



let iteration = 0
names.forEach((name) => {
    iteration++

    const order = fs.readFileSync(getRandomOrder(), 'utf8')
    const orderJSON = JSON.parse(order)

    orderJSON.customer = name
    orderJSON.parts = generatePartsList()

    fs.writeFileSync(`./Mock Order List/${iteration}_${name}_${orderJSON.orderType}.json`, JSON.stringify(orderJSON, null, 4))
})


function getRandomOrder() {
    return Math.random() < 0.5 ? './Order JSON Examples/TDH Order.json' : './Order JSON Examples/Horizon Order.json'
}



function generatePartsList() {
    //Standard Parts
    const parts = [
        {
            "name": "Pipe Racks",
            "status": "Unfinished"
        },
        {
            "name": "Hydraulic Tank",
            "status": "Unfinished"
        },
        {
            "name": "Control Panel",
            "status": "Unfinished"
        },
        {
            "name": "Pins",
            "status": "Unfinished"
        }
    ]

    //Decide Full and Half Sides
    if (Math.random() < 0.5) {
        parts.push({
            "name": "Utility Boxes",
            "details": {
                "driverSide": "Full",
                "passengerSide": "Half"
            },
            "status": "Unfinished"
        })
    } else {
        parts.push({
            "name": "Utility Boxes",
            "details": {
                "driverSide": "Half",
                "passengerSide": "Full"
            },
            "status": "Unfinished"
        })
    }

    //Chance for Undermount Boxes
    if (Math.random() < 0.5) {
        parts.push({
            "name": "Undermount Boxes",
            "details": {
                "length": generateUndermountLength(),
                "driverSide": true,
                "passengerSide": true
            }
        })
    }

    return parts
}



function generateUndermountLength() {
    return Math.random() < 0.5 ? '24"' : '60"'
}