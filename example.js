const fs = require('fs')





let date = new Date();
let options = { month: '2-digit', day: '2-digit', year: 'numeric' };
let formattedDate = date.toLocaleDateString('en-US', options);
console.log(formattedDate);  // Output: 11/03/2023
