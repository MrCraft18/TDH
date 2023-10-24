fs = require('fs')

const list = fs.readdirSync("./Mock Order List")

list.sort((a, b) => {
    const numA = parseInt(a.split('_')[0], 10);
    const numB = parseInt(b.split('_')[0], 10);
    return numA - numB;
  });

console.log(list)