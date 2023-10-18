import { defineConfig } from 'dumi';

const logo = 'https://cdn.jsdelivr.net/gh/wangxingkang/pictures@latest/imgs/sensoro-design.svg';

const base = '/custom-scrollbar/';
const isProd = process.env.NODE_ENV === 'production';

const prodConfig = isProd
  ? defineConfig({
      ssr: {},
      mfsu: false,
    })
  : defineConfig({});

export default defineConfig({
  base,
  publicPath: base,
  themeConfig: {
    name: 'Scrollbar',
    logo,
    socialLinks: {
      github: 'https://github.com/pansyjs/custom-scrollbar',
    },
  },
  favicons: [logo],
  hash: true,
  ...prodConfig,
});
