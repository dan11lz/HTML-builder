const fs = require('fs');
const path = require('path');
const text = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const { stdout, stdin, exit } = require('process');

stdout.write('Enter: ');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdout.write('Bye');
    exit();
  }
  text.write(data);
});

process.on('SIGINT', () => {
  stdout.write('\nBye');
  exit();
});
