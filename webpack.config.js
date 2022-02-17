const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all",
        },
    };
    if (isProd) {
        config.minimizer = [
            new TerserWebpackPlugin(),
            new CssMinimizerPlugin(),
        ];
    }
    return config;
};

module.exports = {
    entry: {
        main: ["@babel/polyfill", "./src/index.js"],
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "static/js/[name].[fullhash].js",
    },
    mode: "development",
    optimization: optimization(),
	performance: false,
    devServer: {
		historyApiFallback: true,
        hot: true,
        port: 3000,
        host: "localhost",
        static: { directory: path.join(__dirname, "src") },
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/html/index.html",
            favicon: "./public/webpack.png",
            minify: {
                collapseWhitespace: isProd,
            },
        }),
        new MiniCssExtractPlugin({
            filename: "static/css/main.[contenthash].css",
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "public/"),
                    to: path.resolve(__dirname, "build/"),
                },
            ],
        }),
        new ESLintPlugin({
            extensions: ["jsx"],
        }),
    ],
    resolve: {
        extensions: [".js", ".ts", ".jsx", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|jpg|jpeg|svg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "img/[path]/[name].[ext]",
                    },
                },
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ["file-loader"],
            },
            {
                test: /\.(m?js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env","@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.tsx?$/,
                use:{
                    loader: "ts-loader"
                }
            }
            
        ],
    },
};
