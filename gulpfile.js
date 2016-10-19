var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require("gulp-rename"),
	cssmini = require('gulp-minify-css'),
	cssver = require('gulp-make-css-url-version'),
	autopre = require('gulp-autoprefixer'),
	htmlrev = require('gulp-rev-append'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	htmlmin = require('gulp-htmlmin'),
	less = require('gulp-less'),
	browsersync = require('browser-sync'),
	reload = browsersync.reload,
	cdn = require('gulp-cdn-replace'),
	gulpSequence = require('gulp-sequence'),
	spriter = require('gulp-css-spriter');

gulp.task('jsmin', function() {
	gulp.src('js/*.js')
		.pipe(uglify({
			mangle: true,
			compress: true
		}))
		.pipe(rename({
		    dirname: "/",
		    //basename: "base",
		    suffix: ".min",
		    extname: ".js"
		  }))
		.pipe(gulp.dest('dist/dev/js'));
});
gulp.task('cssmin', function () {
    gulp.src('css/*.css')
    	.pipe(cssver({
    		format:"yyyyMdhhmmss",
    		useDate:true
    	}))
//  	.pipe(autopre({
//          browsers: ['last 2 versions', 'ie 6-8'],
//          cascade: true,
//          remove:true
//      }))
        .pipe(cssmini({
            advanced: false,
            compatibility: 'ie7'
        }))
        .pipe(rename({
		    dirname: "/",
		    //basename: "base",
		    suffix: ".min",
		    extname: ".css"
		  }))
        .pipe(gulp.dest('dist/dev/css'));
});
gulp.task('jsmind', function() {
	gulp.src('js/*.js')
		.pipe(uglify({
			mangle: true,
			compress: true
		}))
		.pipe(rename({
		    dirname: "/",
		    //basename: "base",
		    suffix: ".min",
		    extname: ".js"
		  }))
		.pipe(gulp.dest('dev/js'));
});
gulp.task('cssmind', function () {
    gulp.src('css/*.css')
    	.pipe(cssver({ 
    		format:"yyyyMdhhmmss",
    		useDate:true
    	}))
//  	.pipe(autopre({
//          browsers: ['last 2 versions', 'ie 6-8'],
//          cascade: true,
//          remove:true
//      }))
        .pipe(cssmini({
            advanced: false,
            compatibility: 'ie7'
        }))
        .pipe(rename({
		    dirname: "/",
		    //basename: "base",
		    suffix: ".min",
		    extname: ".css"
		  }))
        .pipe(gulp.dest('dev/css'));
});
gulp.task('sprit', function() {
    var timestamp = +new Date();
    //需要自动合并雪碧图的样式文件?_s
    return gulp.src('./css/reset.css')
        .pipe(spriter({
            // 生成的spriter的位置
            'spriteSheet': './dist/img/sprite'+timestamp+'.png',
            // 生成样式文件图片引用地址的路径
            // 如下将生产：backgound:url(../images/sprite20324232.png)
            'pathToSpriteSheetFromCSS': '../img/sprite'+timestamp+'.png'
        }))
        //.pipe('cssmind')
        //产出路径
        .pipe(gulp.dest('./dev/css'));
});
gulp.task('imgmin', function () {
    gulp.src('img/*.{png,jpg,gif,svg,ico}')
        .pipe(imagemin({
        	optimizationLevel: 5,
            progressive: true,
            interlaced: true, 
            multipass: true ,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()] 
        }))
        .pipe(gulp.dest('dist/img'));
});
gulp.task('imgsome', function () {
    gulp.src('img/*.{png,jpg,gif,svg,ico}')
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});
gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    };
    gulp.src('*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'));
});
gulp.task('htmlmv', function () {
    var options = {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    };
    gulp.src('*.html')
    	.pipe(htmlrev())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'));
});
gulp.task('htmlv', function () {
    gulp.src('./*.html')
        .pipe(htmlrev())
        .pipe(gulp.dest('dist'));
});
gulp.task('htmlvd', function () {
    gulp.src('./dev/*.html')
        .pipe(htmlrev())
        .pipe(gulp.dest('dist/dev'));
});
gulp.task('cdn', function() {
    gulp.src('dist/dev/*.html')
        .pipe(cdn({
            dir: 'dist/dev',
            root: {
                js:'http://n.7k7kimg.cn/uploads/cdn/gw_lycq/',
                css:'http://n.7k7kimg.cn/uploads/cdn/gw_lycq/'
            }
        }))
        .pipe(gulp.dest('dist/dev'));
});
gulp.task('doless', function () {
    gulp.src('less/index.less')
        .pipe(less())
        .pipe(gulp.dest('css'));
});
gulp.task('server', function() {
  browsersync({
    server: {
      baseDir: 'dist'
    }
  });
  gulp.watch(['*.html', 'css/**/*.css', 'js/**/*.js'], {cwd: 'dist'}, reload);
});
gulp.task('wache', function () {
    gulp.watch('src/*.css', ['cssmind']);
    gulp.watch('js/*.js', ['jsmind']);
});
//dev下修改版本号依赖当前目录静态文件
//dist/dev下修改cdn路径依赖当前目录静态文件
//先版本号，后cdn。版本号，cdn操作不能同时进行

gulp.task('do', ['jsmin','jsmind','cssmind','htmlv','imgsome']);
gulp.task('help', function(){
	console.log("=================================================================");
	console.log("	*线上请先执行'htmlvd'再执行'cdn'！！！");
	console.log("	*dev目录下只修改html文件，静态文件请在源根目录修改！！！");
	//console.log("	jschk-------------------------------[检查js文件]");
	console.log("	jsmin-------------------------------[压缩js文件]");
	console.log("	doless------------------------------[编译less文件]")
	console.log("	sprit-------------------------------[css sprit(匹配‘?_s’合并)]")
	console.log("	cssmin------------------------------[压缩css文件，添加url版本号]")
	console.log("	imgmin------------------------------[压缩img文件]")
	console.log("	imgsome-----------------------------[压缩修改过的img文件]")
	console.log("	htmlmin-----------------------------[压缩html文件]")
	console.log("	htmlv-------------------------------[添加html版本号]")
	console.log("	htmlvd------------------------------[添加html版本号-dev目录]")
	console.log("	cdn---------------------------------[替换cdn路径]")
	console.log("	do----------------------------------[打包线下文件]")
	console.log("	server------------------------------[web浏览]")
	console.log("=================================================================");
});