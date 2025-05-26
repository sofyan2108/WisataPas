const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const common = require('./webpack.common');
const dotenv = require('dotenv');

// Load environment variables from .env file
const env = dotenv.config().parsed || {};

// Fallback values for environment variables
const envKeys = {
    'process.env.LOKA_CLIENT_ID': JSON.stringify(env.LOKA_CLIENT_ID || 'dummy_client_id_for_development'),
    'process.env.LOKA_CLIENT_SECRET': JSON.stringify(env.LOKA_CLIENT_SECRET || 'dummy_secret_key_for_development'),
    'process.env.API_ENVIRONMENT': JSON.stringify(env.API_ENVIRONMENT || 'staging')
};

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new webpack.DefinePlugin(envKeys)
    ],
    devServer: {
        static: path.resolve(__dirname, '../dist'),
        open: true,
        port: 8080,
        historyApiFallback: {
            rewrites: [
                { from: /^\/$/, to: '/#/' }
            ]
        },
        client: {
            overlay: {
                errors: true,
                warnings: true,
            },
        },
        compress: true,
    },
}); 