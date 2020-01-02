"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function htmlLoader() {
    return {
        test: /\.(html|tpl)$/,
        loader: 'html-loader',
        options: BalmJS.config.env.isProd
            ? Object.assign({}, BalmJS.config.html.options, {
                removeAttributeQuotes: false
            })
            : {}
    };
}
exports.default = htmlLoader;
