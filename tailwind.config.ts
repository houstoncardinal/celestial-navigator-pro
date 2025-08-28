import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'orbitron': ['Orbitron', 'monospace'],
				'space': ['Space Grotesk', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Futuristic Theme Colors
				neon: {
					blue: 'hsl(var(--neon-blue))',
					cyan: 'hsl(var(--neon-cyan))',
					purple: 'hsl(var(--neon-purple))',
					pink: 'hsl(var(--neon-pink))',
					green: 'hsl(var(--neon-green))',
					orange: 'hsl(var(--neon-orange))',
					DEFAULT: 'hsl(var(--neon-blue))'
				},
				// Legacy Space Theme Colors (for compatibility)
				cosmic: {
					purple: 'hsl(var(--accent))',
					blue: 'hsl(var(--neon-blue))',
					DEFAULT: 'hsl(var(--accent))'
				},
				stellar: {
					gold: 'hsl(var(--neon-orange))',
					DEFAULT: 'hsl(var(--neon-orange))'
				},
				nebula: {
					violet: 'hsl(var(--neon-purple))',
					DEFAULT: 'hsl(var(--neon-purple))'
				},
				space: {
					deep: 'hsl(var(--background))',
					starfield: 'hsl(var(--muted))',
					DEFAULT: 'hsl(var(--background))'
				}
			},
			backgroundImage: {
				'gradient-deep': 'var(--gradient-deep)',
				'gradient-neon': 'var(--gradient-neon)',
				'gradient-cosmic': 'var(--gradient-cosmic)',
				'gradient-stellar': 'var(--gradient-stellar)',
				'gradient-futuristic': 'linear-gradient(135deg, hsl(var(--neon-blue)), hsl(var(--neon-cyan)))'
			},
			boxShadow: {
				'glow-neon': 'var(--glow-neon)',
				'glow-cyan': 'var(--glow-cyan)',
				'glow-purple': 'var(--glow-purple)',
				'futuristic': 'var(--shadow-futuristic)',
				'neon-pulse': '0 0 30px hsl(var(--neon-blue) / 0.6)',
				'neon-glow': '0 0 40px hsl(var(--neon-blue) / 0.8)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'xl': 'calc(var(--radius) + 4px)',
				'2xl': 'calc(var(--radius) + 8px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(var(--neon-blue) / 0.3)' },
					'50%': { boxShadow: '0 0 40px hsl(var(--neon-blue) / 0.6)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'rotate-slow': {
					'from': { transform: 'rotate(0deg)' },
					'to': { transform: 'rotate(360deg)' }
				},
				// New Futuristic Animations
				'float-futuristic': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'25%': { transform: 'translateY(-10px) rotate(1deg)' },
					'50%': { transform: 'translateY(-5px) rotate(-1deg)' },
					'75%': { transform: 'translateY(-15px) rotate(0.5deg)' }
				},
				'grid-move': {
					'0%': { transform: 'translate(0, 0)' },
					'100%': { transform: 'translate(50px, 50px)' }
				},
				'neon-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(var(--neon-blue) / 0.4)' },
					'50%': { boxShadow: '0 0 40px hsl(var(--neon-blue) / 0.8), 0 0 60px hsl(var(--neon-blue) / 0.4)' }
				},
				'neon-float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'neon-rotate': {
					'from': { transform: 'rotate(0deg)' },
					'to': { transform: 'rotate(360deg)' }
				},
				'neon-glow': {
					'0%, 100%': { filter: 'drop-shadow(0 0 20px hsl(var(--neon-blue) / 0.6))' },
					'50%': { filter: 'drop-shadow(0 0 40px hsl(var(--neon-blue) / 1))' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'zoom-in': {
					'0%': { transform: 'scale(0.8)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'bounce-gentle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 20s linear infinite',
				// New Futuristic Animations
				'float-futuristic': 'float-futuristic 25s ease-in-out infinite',
				'grid-move': 'grid-move 20s linear infinite',
				'neon-pulse': 'neon-pulse 3s ease-in-out infinite',
				'neon-float': 'neon-float 4s ease-in-out infinite',
				'neon-rotate': 'neon-rotate 30s linear infinite',
				'neon-glow': 'neon-glow 2s ease-in-out infinite',
				'slide-in-left': 'slide-in-left 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.6s ease-out',
				'zoom-in': 'zoom-in 0.5s ease-out',
				'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite'
			},
			// Enhanced Spacing for Mobile-First Design
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
				'144': '36rem'
			},
			// Enhanced Screens for Better Responsiveness
			screens: {
				'xs': '475px',
				'3xl': '1600px',
				'4xl': '1920px'
			},
			// Enhanced Z-Index for Layering
			zIndex: {
				'60': '60',
				'70': '70',
				'80': '80',
				'90': '90',
				'100': '100'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;