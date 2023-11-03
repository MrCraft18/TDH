const ExcelJS = require('exceljs');

async function searchInExcelAndFetchNext() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('./reference/Excel/HH10K122024-30_Ace Drilling .xlsx');
    
    const worksheet = workbook.worksheets[0]; // Assuming you're working with the first sheet

    //Initialize Order Object
    let orderJSON = {}

    // Define your search strings
    const searches = [
        {
            parameter: 'serial',
            target: 'Serial # -',
            action: (nextCell) => {
                console.log('Found Serial: ' + nextCell)
                orderJSON.serial = nextCell
            }
        },
        {
            parameter: 'customer',
            target: 'Customer - ',
            action: (nextCell) => {
                console.log('Found Customer: ' + nextCell)
                orderJSON.customer = nextCell
            }
        },
        {
            parameter: 'type',
            target: 'Serial # -',
            action: (nextCell) => {
                console.log('Found Customer: ' + nextCell)
                orderJSON.customer = nextCell
            }
        },
    ];

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            if (cell.value && typeof cell.value === 'string') {
                for (const search of searches) {
                    if (cell.value.includes(search.target)) {
                        const nextCell = row.getCell(colNumber + 1);
                        search.action(nextCell);
                    }
                }
            }
        });
    });
}

// Execute the search
searchInExcelAndFetchNext();
