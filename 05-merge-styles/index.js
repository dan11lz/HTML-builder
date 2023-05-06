const fs = require('fs');
const path = require('path');
const styles = path.join(__dirname, 'styles');
const bundle = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css')
);

fs.readdir(styles, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  for (let file of files) {
    if (path.extname(file.name) === '.css') {
      const srcFile = fs.createReadStream(
        path.join(__dirname, 'styles', file.name),
        'utf-8'
      );
      srcFile.on('data', (chunk) => bundle.write(chunk));
    }
  }
});
