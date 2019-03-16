import gulp from 'gulp';
import gulpif from 'gulp-if';
import gutil from 'gulp-util';
import args from './util/args';

//监听app目录下的文件，若发生变化自动调用scripts/pages/css中的构建脚本
//之后es6转成es5/es3 并写到server目录下的文件
gulp.task('browser',(cb)=>{
  if(!args.watch) return cb();
  //监听原始文件下js发生变化
  gulp.watch('app/**/*.js',['scripts']);
  gulp.watch('app/**/*.ejs',['pages']);
  gulp.watch('app/**/*.css',['css']);
});