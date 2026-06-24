module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true, // Add Node.js environment
    },
    extends: [
        "eslint:recommended",
        "plugin:vue/essential",
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: [
        "vue",
    ],
    rules: {
        "no-undef": "off", // Disable no-undef for process.env usage
    },
    globals: {
        process: "readonly", // Define process as a global variable
    },
};
