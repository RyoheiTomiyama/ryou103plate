'use strict'
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();
var pngquant = require('imagemin-pngquant');

//ejsタスク
gulp.task('ejs',function(){
	var json = require('./source/index.json');
	gulp.src(["./source/**/*.ejs","!./source/**/_*.ejs"])
		.pipe($.plumber())
		.pipe($.ejs({
			jsonData: json,
			msg: "running ejs..."
		}))
		.pipe(gulp.dest("./public"))
		.pipe(browser.stream());
});

//sassタスク
gulp.task('sass',function(){
	gulp.src("./source/sass/style.scss")
		.pipe($.sass({
			errLogToConsole: true,
			sourceComments: 'normal',
			sourceMap: true
		}))
		.pipe($.autoprefixer({
			browsers: ['last 3 version','ie >= 8']
		}))
		.pipe(gulp.dest("./public/css"))
		.pipe(browser.stream());
});

//imageminタスク
gulp.task('imagemin',function(){
	gulp.src("./source/img/**/*")
		.pipe($.imagemin({
			progressive: true,
			use: [pngquant()]
		}))
		.pipe(gulp.dest('./public/img'))
		.pipe(browser.stream());
});

//connectタスク
gulp.task('connect',function(){
	$.connect.server({
		root: './public',
		livereload: true
	});
});

//BrowserSyncタスク
var browser = require('browser-sync').create();
gulp.task('browser',function(){
	browser.init({
		server:{
			baseDir: "./public"
		}
	});

	gulp.watch("./source/sass/*.scss",['sass']);
	gulp.watch("./source/**/*.ejs",['ejs']);
	gulp.watch("./source/img/**/*",['imagemin']);
});


gulp.task('watch',function(){
	gulp.watch('./source/**/*.ejs',['ejs']);
});
gulp.task('default',['browser']);
