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
          '/xlang/examples'
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
      }
    ],
    nav: [
      { text: '首页', link: '/' },
      { text: 'XLang', link: '/xlang/' },
      { text: 'XLex', link: '/xlex/' },
      { text: 'XParse', link: '/xparse/' }
    ]
  }
};