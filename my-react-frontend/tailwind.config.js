/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#F64060",
				secondary: "#F05537",
				accent: "#FF8C66",
				complementary: "#60F6E2",
				neutral1: "#F5F5F5",
				neutral2: "#333333",
			},
			fontFamily: {
				sans: ["Helvetica", "Arial", "sans-serif"],
				techMono: ["Share Tech Mono", "monospace"],
			},
		},
	},
	plugins: [],
};
