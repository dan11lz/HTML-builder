const fs = require('fs');
const path = require('path');
const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  for (let file of files) {
    if (file.isFile()) {
      fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, unit) => {
        if (err) throw err;
        console.log(
          path.parse(file.name).name +
            ' - ' +
            path.extname(file.name).substring(1) +
            ' - ' +
            unit.size +
            'byte'
        );
      });
    }
  }
});
