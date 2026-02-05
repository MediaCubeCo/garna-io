const path = require('path');

module.exports = {
	webpack: {
		configure: (webpackConfig, { env, paths }) => {
			// Ensure .tsx/.ts resolve when entry is .js
			const resolve = webpackConfig.resolve || {};
			const existing = resolve.extensions || ['.js', '.json', '.wasm'];
			const tsExtensions = ['.tsx', '.ts'];
			const rest = existing.filter((ext) => !tsExtensions.includes(ext));
			webpackConfig.resolve = { ...resolve, extensions: [...tsExtensions, ...rest] };

			// Modify output configuration for widget bundle
			webpackConfig.output = {
				...webpackConfig.output,
				filename: 'garna-widget.js',
				library: {
					name: 'GarnaWidgetExport',
					type: 'window',
				},
				globalObject: 'window',
			};

			// Disable code splitting to create a single bundle
			webpackConfig.optimization = {
				...webpackConfig.optimization,
				runtimeChunk: false,
				splitChunks: {
					cacheGroups: {
						default: false,
					},
				},
			};

			// Ensure CSS is injected inline into the JS bundle
			const cssRule = webpackConfig.module.rules.find((rule) => rule.oneOf);

			if (cssRule) {
				cssRule.oneOf.forEach((rule) => {
					if (rule.test && rule.test.toString().includes('css')) {
						// Keep CSS modules but ensure they're bundled
						if (rule.use) {
							rule.use = rule.use.map((loader) => {
								if (typeof loader === 'object' && loader.loader && loader.loader.includes('mini-css-extract-plugin')) {
									// Replace mini-css-extract-plugin with style-loader for inline CSS
									return {
										loader: require.resolve('style-loader'),
									};
								}
								return loader;
							});
						}
					}
				});
			}

			// Remove the MiniCssExtractPlugin to prevent separate CSS file generation
			webpackConfig.plugins = webpackConfig.plugins.filter(
				(plugin) => plugin.constructor.name !== 'MiniCssExtractPlugin'
			);

			return webpackConfig;
		},
	},
};
