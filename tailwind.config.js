/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    darkMode: "class", // Crucial: enables manual/system switching
    theme: {
        extend: {
            colors: {
                background: "#f2f2f2",
                foreground: "#022401",
                accent: "#f96007",
                "accent-green": "#bbcf8d",
                "text-color": "#545454",
                "light-gray": "#f1f1f1",
                "gray-blue": "#9ca3af",
                "light-orange": "#ffe3c1",
            },
        },
    },
    plugins: [],
};
