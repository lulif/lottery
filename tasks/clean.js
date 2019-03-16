import gulp from 'gulp';
import del from 'del';
import args from './util/args';

//运行文件重新更新时，清除上次的
gulp.task('clean',()=>{
  return del(['server/public','server/views'])
})
