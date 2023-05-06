const fs = require('fs');
const path = require('path');
const filesCopy = path.join(__dirname, 'files-copy');

fs.mkdir(filesCopy, () => {
  fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
    if (err) throw err;
    for (let file of files) {
      fs.unlink(path.join(__dirname, 'files-copy', file), (err) => {
        if (err) throw err;
      });
    }
  });
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    if (err) throw err;
    for (let file of files) {
      fs.copyFile(
        path.join(__dirname, 'files', file),
        path.join(__dirname, 'files-copy', file),
        () => {}
      );
    }
  });
});
