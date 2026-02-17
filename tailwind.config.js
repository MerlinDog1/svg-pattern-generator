/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#E6F0FF',
					100: '#CCE0FF',
					500: '#0066FF',
					600: '#0052CC',
					900: '#003D99',
				},
				neutral: {
					50: '#FAFAFA',
					100: '#F5F5F5',
					200: '#E5E5E5',
					500: '#A3A3A3',
					700: '#404040',
					900: '#171717',
				},
				success: '#34C759',
				error: '#FF3B30',
				warning: '#FF9500',
				bg: {
					primary: '#FFFFFF',
					surface: '#FAFAFA',
				},
			},
			fontFamily: {
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
				mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', 'monospace'],
			},
			fontSize: {
				'heading-lg': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
				'heading-md': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
				'body-lg': ['18px', { lineHeight: '1.5' }],
				'body': ['16px', { lineHeight: '1.5' }],
				'body-medium': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
				'small': ['14px', { lineHeight: '1.5' }],
				'caption': ['12px', { lineHeight: '1.4', letterSpacing: '0.01em' }],
				'mono': ['14px', { lineHeight: '1.6' }],
			},
			spacing: {
				'1': '8px',
				'2': '16px',
				'3': '24px',
				'4': '32px',
				'6': '48px',
				'8': '64px',
				'12': '96px',
				'16': '128px',
			},
			borderRadius: {
				'md': '12px',
				'lg': '16px',
				'full': '9999px',
			},
			boxShadow: {
				'sm': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
				'md': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
				'lg': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
			},
			transitionDuration: {
				'fast': '200ms',
				'base': '250ms',
				'slow': '300ms',
			},
			transitionTimingFunction: {
				'default': 'ease-out',
				'smooth': 'ease-in-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}