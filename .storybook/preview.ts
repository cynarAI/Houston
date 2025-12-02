import type { Preview } from "@storybook/react";
import "../client/src/index.css";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#1a1a2e" },
        { name: "space", value: "#0f0f23" },
      ],
    },
  },
};

export default preview;
