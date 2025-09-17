const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  devServer: {
    port: 3003,
  },
  webpack: {
    plugins: {
      add: [
        new ModuleFederationPlugin({
          name: "EventModule",
          exposes: {
            "./EventSampleComponent": "./src/shared/EventSampleComponent",
          },
          filename: "remoteEntry.js",
          shared: {
            react: { singleton: true },
            "react-dom": { singleton: true },
          },
        }),
      ],
    },
    configure: (webpackConfig: any) => ({
      ...webpackConfig,
      output: {
        ...webpackConfig.output,
        publicPath: "auto",
      },
    }),
  },
};
export {}