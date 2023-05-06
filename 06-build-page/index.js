const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
const srcAssets = path.join(__dirname, 'assets');
const projectDistAssets = path.join(__dirname, './project-dist/assets');
const projectDistStyles = path.join(__dirname, 'styles');
const templateHtml = path.join(__dirname, 'template.html');

fs.mkdir(projectDist, { withFileTypes: true }, () => {
  fs.readdir(srcAssets, (err, folders) => {
    if (err) throw err;
    for (let folder of folders) {
      fs.mkdir(
        path.join(projectDistAssets, folder),
        { recursive: true },
        () => {
          fs.readdir(path.join(srcAssets, folder), (err, files) => {
            if (err) throw err;
            for (let file of files) {
              fs.copyFile(
                path.join(srcAssets, folder, file),
                path.join(projectDistAssets, folder, file),
                () => {}
              );
            }
          });
        }
      );
    }
  });

  const stylesStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css')
  );
  fs.readdir(projectDistStyles, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    for (let file of files) {
      if (path.extname(file.name) === '.css') {
        const srcFile = fs.createReadStream(
          path.join(__dirname, 'styles', file.name),
          'utf-8'
        );
        srcFile.on('data', (chunk) => stylesStream.write(chunk));
      }
    }
  });

  const htmlStream = fs.createReadStream(templateHtml, 'utf-8');
  function buildPage() {
    const htmlFile = fs.createWriteStream(path.join(projectDist, 'index.html'));
    htmlStream.on('data', (chunk) => {
      let text = '';
      const change = function (chunk) {
        text = chunk;
        const tagStart = text.indexOf('{{');
        const tagEnd = text.indexOf('}}');
        const tag = text.slice(tagStart + 2, tagEnd);
        const htmlContent = fs.createReadStream(
          path.join(__dirname, 'components', tag + '.html')
        );
        let componentsData = '';
        htmlContent.on('data', (chunk) => {
          componentsData = componentsData + chunk.toString();
          text =
            text.slice(0, tagStart) + componentsData + text.slice(tagEnd + 2);
          if (text.indexOf('}}') + 1) {
            change(text);
          } else {
            htmlFile.write(text);
          }
        });
      };
      change(chunk);
    });
  }
  buildPage();
});
