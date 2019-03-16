import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';

//各任务脚本的执行顺序
gulp.task('build',gulpSequence('clean','css','pages','scripts',['browser','serve']));
