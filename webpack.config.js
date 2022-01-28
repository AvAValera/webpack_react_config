const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

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
        main: ["@babel/polyfill", "./src/index.jsx"],
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "static/js/[name].[fullhash].js",
    },
    mode: "development",
    optimization: optimization(),
    devServer: {
        hot: true,
        port: 3000,
        host: "localhost",
        static: "./src",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
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
                    from: path.resolve(__dirname, "public/img"),
                    to: path.resolve(__dirname, "build/img"),
                },
            ],
        }),
        new FaviconsWebpackPlugin("./public/webpack.png"),
    ],
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
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react"],
                    },
                },
                resolve: {
                    extensions: ["js", ".jsx"],
                },
            },
        ],
    },
};
