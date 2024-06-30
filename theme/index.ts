import { createConfig } from "@gluestack-ui/themed";
import { config as defaultConfig } from "@gluestack-ui/config";

const config = createConfig({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    fontSizes: {
      ...defaultConfig.tokens.fontSizes,
      newFontSize: 90,
    },
  },
});

export default config;
