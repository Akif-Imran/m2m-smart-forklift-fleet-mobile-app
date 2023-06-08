module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          alias: {
            "@": "./src",
            "@api": "./src/api/index.ts",
            "@api-types": "./src/api/types.ts",
            "@assets": "./src/assets",
            "@components": "./src/components/index.ts",
            "@context": "./src/context/index.ts",
            "@helpers": "./src/helpers/index.ts",
            "@hooks": "./src/hooks/index.ts",
            "@navigation": "./src/navigation/index.ts",
            "@navigation-types": "./src/navigation/types.ts",
            "@screens": "./src/screens/index.ts",
            "@services": "./src/services/index.ts",
            "@theme": "./src/theme/index.ts",
            "@types": "./src/types",
            "@utility": "./src/utility/index.ts",
          },
        },
      ],
    ],
  };
};
