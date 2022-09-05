# Demo of using Gulp as a task manager for handwritten development of static website templates right in the browser.
There are certainly cleaner and nicer methods. The gulpfile.js is based on my long-standing configuration file, which has been optimized for my needs over and over again. ...

## List of all tasks used
- Deleting the distribution folder on new build.
- Compile scss to css and compress the code.
- Compress and concatenate js files.
- Copy all html and fonts files to the distribution folder.
- Image optimization for jpgs, gifs and pngs.
- Icon optimization for svgs.
- Generate svg icons to a sprite file.
- Copy all generated files to the distribution folder.
- After a new build, automatically open or reload the index.html in the browser.
- Monitor the source folder to run tasks when changes occur.