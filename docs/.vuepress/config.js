module.exports = {
  title: '孤独熊熊',
  description: 'A Simple Programming Language Powered by XLex and XParse.',
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],
  themeConfig: {
    sidebar: [
      {
        title: '孤独熊熊',
        children: [
          '/xlang/',
          '/xlang/syntax',
          '/xlang/fn',
          '/xlang/examples',
          '/xlang/deep',
        ],
      },
      {
        title: 'XLex',
        children: ['/xlex/', '/xlex/usage', '/xlex/reg'],
      },
      {
        title: 'XParse',
        children: ['/xparse/', '/xparse/usage'],
      },
      {
        title: '原理',
        children: ['/deep/setmap', '/deep/worklist', '/deep/hopcroft'],
      },
      {
        title: '其他应用',
        children: ['/other/complex-calculator'],
      },
    ],
    nav: [
      { text: '首页', link: '/' },
      { text: '孤独熊熊', link: '/xlang/' },
      { text: 'XLex', link: '/xlex/' },
      { text: 'XParse', link: '/xparse/' },
    ],
  },
  plugins: [
    [
      'vuepress-plugin-mathjax',
      {
        target: 'svg',
      },
    ],
  ],
};
