const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let names = ['John Smith', 'Sarah Jane', 'Robert Brown', 'James Wilson'];

const displayNames = () => {
    names.forEach((name, index) => {
        console.log(`${index + 1}. ${name}`);
    });
};

const moveName = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= names.length) {
        console.log('Move not allowed.');
        return;
    }
    const [name] = names.splice(fromIndex, 1);  // Remove the name from its original position
    names.splice(toIndex, 0, name);  // Insert the name at the new position
    displayNames();
};

const promptUser = () => {
    rl.question('Enter the number of the name you want to move, followed by the number of the position to move it to (e.g., "1 3"): ', (input) => {
        const [fromStr, toStr] = input.split(' ');
        const fromIndex = parseInt(fromStr, 10) - 1;
        const toIndex = parseInt(toStr, 10) - 1;
        if (isNaN(fromIndex) || isNaN(toIndex) || fromIndex < 0 || fromIndex >= names.length || toIndex < 0 || toIndex >= names.length) {
            console.log('Invalid input. Please try again.');
            promptUser();
        } else {
            moveName(fromIndex, toIndex);
            rl.close();
        }
    });
};

displayNames();
promptUser();
