var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

// 给出正确的绝对路径
function resolve(dir) {
	return path.join(__dirname, '..', dir)
}

module.exports = {
	// 配置webpack编译入口
	entry: {
		app: ["babel-polyfill", "./src/main.js"]
	},
	externals: {
		"vue": "Vue",
		"vuex": "Vuex",
		"element-ui": "element-ui"
	},
	// 配置webpack输出路径和命名规则
	output: {
		// webpack输出的目标文件夹路径（例如：/dist）
		path: config.build.assetsRoot,
		// webpack输出bundle文件命名格式
		filename: '[name].js',
		// webpack编译输出的发布路径
		publicPath: process.env.NODE_ENV === 'production' ?
			config.build.assetsPublicPath : config.dev.assetsPublicPath
	},
	// 配置模块resolve的规则
	resolve: {
		// 自动resolve的扩展名
		extensions: ['.js', '.vue', '.json'],
		// 创建路径别名，有了别名之后引用模块更方便，
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': resolve('src')
		}
	},
	// 配置不同类型模块的处理规则
	module: {
		// 对src和test文件夹下的.js和.vue文件使用eslint-loader
		rules: [{
				test: /\.(js|vue)$/,
				loader: 'eslint-loader',
				enforce: 'pre',
				include: [resolve('src'), resolve('test')],
				options: {
					formatter: require('eslint-friendly-formatter')
				}
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueLoaderConfig
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				//				exclude: function(path) {
				//					// 路径中含有 node_modules 的就不去解析。
				//					var isNpmModule = !!path.match(/node_modules/);
				//					return isNpmModule;
				//				},
				include: [resolve('src'), resolve('test')],
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		]
	}
}