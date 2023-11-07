const ExcelJS = require('exceljs')

async function parseOrder(file, clientDate) {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(file)
    
    const worksheet = workbook.worksheets[0] // Assuming you're working with the first sheet

    //Initialize Order Object
    let orderJSON = {
        dates: {}
    }

    let partsArray = []

    // Define your search strings
    const searches = [
        {
            parameter: 'serial and type',
            target: 'Serial',
            action: (string) => {
                // console.log('Found Serial: ' + string)
                if (string) {
                    orderJSON.serial = string

                    if (string.startsWith('HH')) {
                        orderJSON.type = 'Horizon'
                    } else {
                        orderJSON.type = 'TDH'
                    }
                } else {
                    throw new Error('Missing Serial #')
                }
            }
        },
        {
            parameter: 'customer',
            target: 'Customer',
            action: (string) => {
                // console.log('Found Customer: ' + string)
                orderJSON.customer = string
            }
        },
        {
            parameter: 'bodyType',
            target: 'Truck Body-',
            action: (string) => {
                // console.log('Found Body Type: ' + string)

                if (string.includes('SB')) {
                    orderJSON.bodyType = string.replace(/ALU DL SB/, 'Service Body')
                } else {
                    orderJSON.bodyType = 'Flat Bed'
                }
            }
        },
        {
            parameter: 'Driver Parts',
            target: 'Drive Side-',
            action: (string) => {
                // console.log('Found Driver Part: ' + string)

                if (string.includes('Utility')) {
                    partsArray.push({
                        name: string.replace('Utility', 'Box'),
                        assignee: "Unassigned Worker",
                        assignDate: "",
                        partStatus: "Unfinished"
                    })
                }

                if (string.includes('Pipe')) {
                    if (string.includes('ustom')) {
                        partsArray.push({
                            name: "Custom Driver Pipe Rack",
                            assignee: "Unassigned Worker",
                            assignDate: "",
                            partStatus: "Unfinished"
                        })
                    } else {
                        partsArray.push({
                            name: "Driver Pipe Rack",
                            assignee: "Unassigned Worker",
                            assignDate: "",
                            partStatus: "Unfinished"
                        })
                    }
                }
            }
        },
        {
            parameter: 'Passenger Parts',
            target: 'Pass Side-',
            action: (string) => {
                // console.log('Found Passenger Part: ' + string)

                if (string.includes('Utility')) {
                    partsArray.push({
                        name: string.replace('Utility', 'Box'),
                        assignee: "Unassigned Worker",
                        assignDate: "",
                        partStatus: "Unfinished"
                    })
                }

                if (string.includes('Pipe')) {
                    if (string.includes('ustom')) {
                        partsArray.push({
                            name: "Custom Passenger Pipe Rack",
                            assignee: "Unassigned Worker",
                            assignDate: "",
                            partStatus: "Unfinished"
                        })
                    } else {
                        partsArray.push({
                            name: "Passenger Pipe Rack",
                            assignee: "Unassigned Worker",
                            assignDate: "",
                            partStatus: "Unfinished"
                        })
                    }
                }
            }
        },
    ];

    try {
        worksheet.eachRow({ includeEmpty: true }, (row) => {
            row.eachCell((cell, colNumber) => {
                if (cell.value && typeof cell.value === 'string') {
                    for (const search of searches) {
                        if (cell.value.includes(search.target)) {
                            const nextCell = row.getCell(colNumber + 1)
                            search.action(nextCell.value)
                        }
                    }
                }
            })
        })
    
        dateObj = worksheet.getCell('H6').text ? new Date(worksheet.getCell('H6').text) : ""
    
        orderJSON.dates.lastUpload = clientDate
        orderJSON.dates.finishDate = dateObj.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', timeZone: 'UTC' })
    
        orderJSON.orderStatus = 'Not Started'
    
        partsArray.push({
            name: "Doors",
            assignee: "Unassigned Worker",
            assignDate: "",
            partStatus: "Unfinished"
        })
    
        partsArray.push({
            name: "Trays",
            assignee: "Unassigned Worker",
            assignDate: "",
            partStatus: "Unfinished"
        })
    
        partsArray.push({
            name: orderJSON.type + " Pins",
            assignee: "Unassigned Worker",
            assignDate: "",
            partStatus: "Unfinished"
        })
    
        partsArray.push({
            name: orderJSON.type + " Hydraulic Tank",
            assignee: "Unassigned Worker",
            assignDate: "",
            partStatus: "Unfinished"
        })
    
        if (orderJSON.bodyType.includes('Service')) {
            partsArray.push({
                name: "Driver Side Boxes",
                assignee: "Unassigned Worker",
                assignDate: "",
                partStatus: "Unfinished"
            })
    
            partsArray.push({
                name: "Passenger Side Boxes",
                assignee: "Unassigned Worker",
                assignDate: "",
                partStatus: "Unfinished"
            })
    
            partsArray.push({
                name: "Frame",
                assignee: "Unassigned Worker",
                assignDate: "",
                partStatus: "Unfinished"
            })
    
            partsArray.push({
                name: "Headache Rack",
                assignee: "Unassigned Worker",
                assignDate: "",
                partStatus: "Unfinished"
            })
    
            partsArray.push({
                name: "Deck Plate",
                assignee: "Unassigned Worker",
                assignDate: "",
                partStatus: "Unfinished"
            })
        } else {
            partsArray.push({
                name: "Side Gate",
                assignee: "Unassigned Worker",
                assignDate: "",
                partStatus: "Unfinished"
            })
        }
    
        if (orderJSON.type === 'TDH') {
            partsArray.push({
                name: "Control Panel",
                assignee: "Unassigned Worker",
                assignDate: "",
                partStatus: "Unfinished"
            })
        } else if (orderJSON.type === 'Horizon') {
            partsArray.push({
                name: "Valve Cover",
                assignee: "Unassigned Worker",
                assignDate: "",
                partStatus: "Unfinished"
            })
        }
    
        orderJSON.parts = partsArray
    
        return orderJSON
    } catch (err) {
        console.log(err)
        
        throw new Error({userError: true, err})
    }
}



module.exports = {
    parseOrder
}
