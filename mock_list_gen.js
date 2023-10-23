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




names.forEach((name) => {
    const order = fs.readFileSync(getRandomOrder(), 'utf8')
    const orderJSON = JSON.parse(order)

    orderJSON.customer = name
})


function getRandomOrder() {
    return Math.random() < 0.5 ? './Order JSON Examples/TDH Order.json' : './Order JSON Examples/Horizon Order.json'
}



function generatePartsList() {
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

    if (Math.random() < 0.5) {
        parts.push()
    }

    {
        "name": "Utility Boxes",
        "details": {
            "driverSide": "Full",
            "passengerSide": "Hald"
        },
        "status": "Unfinished"
    },
}