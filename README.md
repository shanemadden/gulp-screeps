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
...
```
**credentials.js:**
```js
module.exports = {
    email: 'EMAIL',
    password: 'PASSWORD',
    token: 'token'
    branch: 'default',
    ptr: false,
    host: 'someprivateserver.com',
    port: 9000,
    secure: false
};
```
### Options 
- email - the email of your account (Private Servers Only)
- password - the password of your account (Private Servers Only)
- token - the token of your account (Official Server Only) - Get from your screeps account settings
- branch (optional) - the branch you wish to commit the code to
- ptr (optional) - use [Public Test Realm](http://support.screeps.com/hc/en-us/articles/205999532-Public-Test-Realm)
- host (optional) - the url of the host
- port (optional) - the port of the host
- secure (optional) - if the host is using https instead of http
