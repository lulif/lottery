import gulp from 'gulp';
import gulpif from 'gulp-if';
import liveserver from 'gulp-live-server';
import args from './util/args';

//服务器的任务脚本
gulp.task('serve',(cb)=>{
  if(!args.watch) return cb();
  //启动一个服务器
  var server = liveserver.new(['--harmony','server/bin/www']);
  server.start();

//监听（热更新） 
  gulp.watch(['server/public/**/*.js','server/views/**/*.ejs'],function(file){
  	//通知服务器
    server.notify.apply(server,[file]);
  })

//监听需要重启服务器的文件
  gulp.watch(['server/routes/**/*.js','server/app.js'],function(){
  	//服务器重启
    server.start.bind(server)()
  });
})