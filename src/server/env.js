// env is for things that won't necessarily require loading the entire app
// (e.g. migrations)

import dir from './util/dir';
dir.init(require('path').dirname(__dirname));
dir.define('views', 'root', 'views')
dir.define('public', 'root', 'public')
dir.define('logos', 'root', 'public', 'img', 'logos')