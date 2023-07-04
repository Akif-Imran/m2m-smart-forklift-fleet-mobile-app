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
            "@markers": "./src/assets/images/markers/index.ts",
            "@components": "./src/components/index.ts",
            "@constants": "./src/constants/index.ts",
            "@context": "./src/context/index.ts",
            "@context-types": "./src/context/types.ts",
            "@helpers": "./src/helpers/index.ts",
            "@hooks": "./src/hooks/index.ts",
            "@navigation": "./src/navigation/index.ts",
            "@navigation-types": "./src/navigation/types.ts",
            "@screens": "./src/screens/index.ts",
            "@screen-styles": "./src/screens/styles.ts",
            "@services": "./src/services/index.ts",
            "@theme": "./src/theme/index.ts",
            "@types": "./src/types",
            "@utility": "./src/utility/index.ts",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
