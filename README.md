# gulp-screeps

A Gulp plugin for commiting code to your Screeps account.
The plugin is based on the [grunt equivalent](https://github.com/screeps/grunt-screeps).

## Usage

**gulpfile.js:**
```js
var gulp = require('gulp');
var screeps = require('gulp-screeps');
 
gulp.task('screeps', function() {
  gulp.src('*.js')
    .pipe(screeps(options));
});
```

If you don't want to commit your account information, require an other module and export an option object. Don't forget to add the file to your **.gitignore**.
  
**gulpfile.js:**
```js
var gulp = require('gulp');
var screeps = require('gulp-screeps');
var credentials = require('./credentials.js');

gulp.task('screeps', function() {
  gulp.src('*.js')
    .pipe(screeps(credentials));
});
```
**credentials.js:**

Persistent (MMO) World example:
```js
module.exports = {
    email: 'EMAIL',
    token: 'AUTH_TOKEN',
    branch: 'default'
};
```

Public Test Realm example:
```js
module.exports = {
    email: 'EMAIL',
    token: 'AUTH_TOKEN',
    branch: 'default',
    path: '/ptr'
};
```

Season World example:
```js
module.exports = {
    email: 'EMAIL',
    token: 'AUTH_TOKEN',
    branch: 'default',
    path: '/season'
};
```

Private Server example:
```js
module.exports = {
    email: 'USERNAME',
    password: 'PASSWORD',
    branch: 'default',
    host: 'someprivateserver.com',
    port: 21025
};
```

### Options 
- `email` - the email of your account (Private Servers Only)
- `password` - the password of your account (Private Servers Only)
- `token` - the token of your account (Official Server Only) - Get from your screeps account settings
- `branch` (optional) - the branch you wish to commit the code to
- `path` (optional) - use "/season" for Season World or "/ptr" for [Public Test Realm](http://support.screeps.com/hc/en-us/articles/205999532-Public-Test-Realm)
- `host` (optional) - the url or IP address of the host
- `port` (optional) - the port of the host
- `secure` (optional) - if the host is using https instead of http
