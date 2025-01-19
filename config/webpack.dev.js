const modules = ['index', 'article']

// Node.js的核心模块，专门用来处理文件路径
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const getStyleLoaders = (preProcessor) => {
    return [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        'postcss-preset-env' // 能解决大多数样式兼容性问题
                    ]
                }
            }
        },
        preProcessor
    ].filter(Boolean)
}

const getModuleEntry = (moduleName) => {
    return path.resolve(__dirname, '../src/build/' + moduleName + '.js')
}

const getModuleHtml = (moduleName) => {
    return new HtmlWebpackPlugin({
        filename: 'html/' + moduleName + '.html',
        template: './src/html/' + moduleName + '.html',
        chunks: ['common', moduleName],
        inject: true,
        hash: true
    })
}

const moduleConfig = {
    entry: {},
    html: []
}

modules.forEach((m) => {
    moduleConfig.entry[m] = getModuleEntry(m)
    moduleConfig.html.push(getModuleHtml(m))
})

module.exports = {
    // 入口
    // 相对路径和绝对路径都行
    entry: {
        common: path.resolve(__dirname, '../src/build/common.js'),
        ...moduleConfig.entry
    },
    // 输出
    output: {
        // path: 文件输出目录，必须是绝对路径
        // path.resolve()方法返回一个绝对路径
        // __dirname 当前文件的文件夹绝对路径
        path: undefined,
        // filename: 输出文件名
        filename: 'static/js/[name].js',
        // 自动将上次打包目录资源清空
        clean: true
    },
    // 加载器
    module: {
        rules: [
            // css
            {
                // 用来匹配 .css 结尾的文件
                test: /\.css$/,
                // use 数组里面 Loader 执行顺序是从右到左
                use: getStyleLoaders()
            },
            // sass
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders('sass-loader')
            },
            // 图片
            {
                test: /\.(png|jpe?g|gif|webp)$/,
                type: 'asset',
                generator: {
                    // 将图片文件输出到 static/imgs 目录中
                    // 将图片文件命名 [hash:8][ext][query]
                    // [hash:8]: hash值取8位
                    // [ext]: 使用之前的文件扩展名
                    // [query]: 添加之前的query参数
                    filename: 'static/imgs/[hash:8][ext][query]'
                }
            },
            // js
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src/js'), path.resolve(__dirname, 'src/build')],
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true, // 开启babel编译缓存
                    cacheCompression: false // 缓存文件不要压缩
                }
            }
        ]
    },
    // 插件
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/libs', to: 'libs' },
                { from: './src/images', to: 'images' }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].css'
        }),
        new CssMinimizerPlugin(),
        ...moduleConfig.html
    ],
    devServer: {
        host: 'localhost',
        port: '12016',
        open: false,
        hot: true
    },
    // 模式
    mode: 'development',
    devtool: 'cheap-module-source-map'
}
