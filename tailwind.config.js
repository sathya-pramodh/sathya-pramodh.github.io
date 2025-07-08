/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				mono: ['JetBrains Mono', 'monospace'],
			},
			colors: {
				// Tokyo Night Storm colors
				'tokyo-bg': '#24283b',
				'tokyo-bg-dark': '#1f2335',
				'tokyo-bg-highlight': '#292e42',
				'tokyo-terminal-black': '#414868',
				'tokyo-fg': '#c0caf5',
				'tokyo-fg-dark': '#a9b1d6',
				'tokyo-fg-gutter': '#3b4261',
				'tokyo-dark3': '#545c7e',
				'tokyo-comment': '#565f89',
				'tokyo-dark5': '#737aa2',
				'tokyo-blue0': '#3d59a1',
				'tokyo-blue': '#7aa2f7',
				'tokyo-cyan': '#7dcfff',
				'tokyo-blue1': '#2ac3de',
				'tokyo-blue2': '#0db9d7',
				'tokyo-blue5': '#89ddff',
				'tokyo-blue6': '#b4f9f8',
				'tokyo-blue7': '#394b70',
				'tokyo-magenta': '#bb9af7',
				'tokyo-magenta2': '#ff007c',
				'tokyo-purple': '#9d7cd8',
				'tokyo-orange': '#ff9e64',
				'tokyo-yellow': '#e0af68',
				'tokyo-green': '#9ece6a',
				'tokyo-green1': '#73daca',
				'tokyo-green2': '#41a6b5',
				'tokyo-teal': '#1abc9c',
				'tokyo-red': '#f7768e',
				'tokyo-red1': '#db4b4b',
				gray: {
					900: '#24283b',
					800: '#1f2335',
					700: '#292e42',
					600: '#414868',
					500: '#565f89',
					400: '#737aa2',
					300: '#a9b1d6',
					200: '#c0caf5',
					100: '#c0caf5',
				},
				green: {
					400: '#9ece6a',
					300: '#73daca',
				},
				blue: {
					400: '#7aa2f7',
					300: '#89ddff',
				},
				yellow: {
					400: '#e0af68',
					300: '#e0af68',
				},
				purple: {
					400: '#bb9af7',
					300: '#9d7cd8',
				},
				red: {
					400: '#f7768e',
					300: '#db4b4b',
				},
				orange: {
					400: '#ff9e64',
					300: '#ff9e64',
				},
			},
		},
	},
	plugins: [],
};
