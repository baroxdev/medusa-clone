import { withThemeByDataAttribute } from "@storybook/addon-styling"
import "../src/main.css"

export const decorators = [
    withThemeByDataAttribute({
        themes: {
            Light: "light",
            Dark: "dark",
        },
        defaultTheme: "light",
        attributeName: "data-mode",
    }),
]

const preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
}

export default preview
