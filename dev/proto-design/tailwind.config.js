/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // v4.0 Dark Frame Edition — 카드/프레임 기본 팔레트
        dark: {
          charcoal: '#1E1E24',
          deep: '#2A2A32',
          graphite: '#4A4A55',
          surface: '#16161C',
          overlay: '#121218',
        },
        // 세피아/양피지 (레거시 호환용, 일부 이펙트에서 사용)
        sepia: {
          parchment: '#F5E6D3',
          aged: '#E8D5C4',
          cream: '#FFF8E7',
          wash: '#704214',
        },
        // 동전/프레임 색상
        coin: {
          bronze: '#CD7F32',
          'warm-bronze': '#8B4513',
          'dark-bronze': '#5D3A1A',
          gold: '#DAA520',
        },
        // 앞면(태양) 계열
        sun: {
          gold: '#FFD700',
          bright: '#FFF8DC',
          orange: '#FFA500',
          rose: '#FF8C00',
        },
        // 뒷면(달) 계열
        moon: {
          silver: '#C0C0C0',
          light: '#D3D3D3',
          twilight: '#6B7B8C',
          lavender: '#E6E6FA',
        },
        // 텍스트 색상
        ink: {
          brown: '#3D2914',
          faded: '#6B5344',
          deep: '#8B0000',
          gold: '#B8860B',
        },
        // 상태 효과 색상
        effect: {
          attack: '#FF6B6B',
          defense: '#87CEEB',
          buff: '#90EE90',
          debuff: '#9370DB',
          heal: '#FFB6C1',
          power: '#DAA520',
        },
        // 캐릭터 피부톤
        skin: {
          light: '#FFE4C4',
          base: '#FFDAB9',
          shadow: '#E8C4A8',
          blush: '#FFB6C1',
        },
        // 클래스별 색상
        warrior: {
          primary: '#B85450',
          secondary: '#6B7B8B',
          accent: '#8B6914',
        },
        paladin: {
          primary: '#FFD700',
          secondary: '#FFFDD0',
          accent: '#87CEEB',
        },
      },
      // 커스텀 배경
      backgroundImage: {
        'parchment': "linear-gradient(to bottom, #F5E6D3, #E8D5C4)",
        'dark-card': "linear-gradient(to bottom, #1E1E24, #2A2A32)",
        'coin-pattern': "radial-gradient(circle, #DAA520 1px, transparent 1px)",
      },
      // 그림자
      boxShadow: {
        'coin': '0 2px 4px rgba(139, 69, 19, 0.3), inset 0 1px 0 rgba(255, 215, 0, 0.2)',
        'card': '0 4px 8px rgba(61, 41, 20, 0.4)',
        'card-dark': '0 4px 12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
        'gold-glow': '0 0 10px rgba(255, 215, 0, 0.5)',
        'silver-glow': '0 0 10px rgba(192, 192, 192, 0.5)',
      },
      // 테두리
      borderWidth: {
        '3': '3px',
      },
      // 폰트
      fontFamily: {
        'game': ['Space Grotesk', 'Nanum Gothic Coding', 'system-ui', 'sans-serif'],
        'mono': ['Nanum Gothic Coding', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
