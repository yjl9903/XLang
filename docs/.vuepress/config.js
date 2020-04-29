module.exports = {
  title: 'XLang',
  description: 'A Simple Programming Language Powered by XLex and XParse.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }]
  ],
  themeConfig: {
    sidebar: [
      {
        title: 'XLang',
        children: [
          '/xlang/',
          '/xlang/syntax',
          '/xlang/fn',
          '/xlang/examples',
          '/xlang/tac'
        ]
      },
      {
        title: 'XLex',
        children: [
          '/xlex/',
          '/xlex/usage',
          '/xlex/reg'
        ]
      },
      {
        title: 'XParse',
        children: [
          '/xparse/',
          '/xparse/usage'
        ]
      },
      {
        title: '原理',
        children: [
          '/deep/setmap'
        ]
      },
      {
        title: '其他应用',
        children: [
          '/other/complex-calculator'
        ]
      }
    ],
    nav: [
      { text: '首页', link: '/' },
      { text: 'XLang', link: '/xlang/' },
      { text: 'XLex', link: '/xlex/' },
      { text: 'XParse', link: '/xparse/' }
    ]
  },
  plugins: [
    [
      'vuepress-plugin-mathjax',
      {
        target: 'svg',
      }
    ]
  ]
};