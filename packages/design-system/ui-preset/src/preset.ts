import type {Config} from 'tailwindcss'

const preset: Config = {
    content: [],
    plugins: [plugin, require("tailwindcss-animate")] as Config["plugins"],
} satisfies Config;
