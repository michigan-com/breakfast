# Gulp tasks

Moudlarized gulp tasks which makes for a cleaner root gulpfile

## Tasks described

### `./build``
Contains tasks that build files (JS, stylesheets, etc)

Modules in this folder can export a function called `watchFunction` which can be run in the watch task.

#### `./build/public-js.js`
Browserify bundle the public JS found in `../src/js`.

#### `./build/sass.js`
Bundle the sass found in `../src/scss`

#### `./build/server-js.js`
Run the serverside JS through Babel

### `./logos`
Contains tasks for absorbing logos into the system.

#### `./logos/logos.js`
Reads all the SVGs in the `../public/img/logos` folder and gets the aspect ratio of each, saving into a JSON file for easier calculations client side.

### `./watch`
Defines the task `gulp.task('watch')`.Calls the `watchFunction` exported in the modules in `./build`
