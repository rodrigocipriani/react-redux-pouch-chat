const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const shell = require('gulp-shell');
const gulpSequence = require('gulp-sequence');

const isWin = /^win/.test(process.platform);

const deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

// Install npm dependencies Project
gulp.task('start:server', shell.task(['npm start'], { cwd: path.join(__dirname, 'server') }));

// Install npm dependencies Project
gulp.task('install:project', shell.task(['npm install'], { cwd: path.join(__dirname) }));

// Install npm dependencies Client
gulp.task('install:client', shell.task(['npm install'], { cwd: path.join(__dirname, 'client') }));

// Install npm dependencies Server
gulp.task('install:server', shell.task(['npm install'], { cwd: path.join(__dirname, 'server') }));

// Deploing to heroku
gulp.task('deploy:heroku',
  shell.task(['echo REMEMBER TO COMMIT YOUR CHANGES BEFORE DEPLOY TO HEROKU!', 'git push heroku master'],
    { cwd: path.join(__dirname) }));

/*
 * webpack tasks
 * */
// Building Client (Clean)

const buildFolder = path.join('.', 'build');
gulp.task('webpack:build:clean',
  deleteFolderRecursive(path.join(__dirname, 'client', 'build')),
);

const setNodeEnvProductionCommand = isWin ? 'set NODE_ENV=production\\&& ' : 'export NODE_ENV=production && ';
// Building Client
gulp.task('webpack:build',
  shell.task([`${setNodeEnvProductionCommand + path.join('.', 'node_modules', '.bin', 'webpack')} --config webpack.config.js`], { cwd: path.join(__dirname, 'client') }));

// Building Client
gulp.task('webpack:dev',
  shell.task([
    `${path.join(
          '.', 'node_modules', '.bin', 'webpack-dev-server')
             } --progress --profile --colors --config webpack.config.js`],
      { cwd: path.join(__dirname, 'client') }));

gulp.task('install', gulpSequence('install:client', 'install:server', 'build'));
gulp.task('build', gulpSequence('webpack:build:clean', 'webpack:build'));
gulp.task('deploy', ['deploy:heroku']);
gulp.task('dev', ['start:server', 'webpack:dev']);
