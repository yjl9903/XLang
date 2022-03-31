(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{425:function(e,t,a){"use strict";a.r(t);var r=a(56),s=Object(r.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h2",{attrs:{id:"介绍"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#介绍"}},[e._v("#")]),e._v(" 介绍")]),e._v(" "),a("p",[a("a",{attrs:{href:"https://github.com/LonelyKuma/XLex",target:"_blank",rel:"noopener noreferrer"}},[e._v("XLex"),a("OutboundLink")],1),e._v(" 是一个词法分析器工具，它在设计时一定程度上借鉴了 "),a("a",{attrs:{href:"https://github.com/westes/flex/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Flex"),a("OutboundLink")],1),e._v("。你可以使用它构造自己的词法分析规则，并用它来分析输入的代码文本串，生成 "),a("a",{attrs:{href:"https://en.wikipedia.org/wiki/Lexical_analysis#Token",target:"_blank",rel:"noopener noreferrer"}},[e._v("Token 流"),a("OutboundLink")],1),e._v("。XLex 借助 JavaScript 脚本允许你对分析过程做更多的定制。")]),e._v(" "),a("p",[e._v("XLex 为用户提供了命令行工具和 JavaScript 编程接口两种使用方式。你可以直接通过创建默认名为 "),a("code",[e._v("xlex.config.js")]),e._v(" 的配置文件（脚本），来构造你自己的词法规则，并使用命令行工具导入配置文件并解析代码文本串。同时，你也可以在 JavaScript 项目中引入 XLex，传入配置对象来创建一个词法分析器。")]),e._v(" "),a("h2",{attrs:{id:"全局安装命令行工具"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#全局安装命令行工具"}},[e._v("#")]),e._v(" 全局安装命令行工具")]),e._v(" "),a("p",[e._v("确保你已经安装并配置 "),a("a",{attrs:{href:"https://nodejs.org/en/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Node.js 环境"),a("OutboundLink")],1),e._v("，推荐使用最新的版本的 Node.js。")]),e._v(" "),a("p",[e._v("在终端中输入以下命令，即可安装 XLex。")]),e._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[e._v("npm")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v(" -g @xlor/xlex\n")])])]),a("p",[e._v("输入以下命令，确认 XLex 已经成功安装。")]),e._v(" "),a("div",{staticClass:"language-base extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("xlex --version\n")])])]),a("h2",{attrs:{id:"在-javascript-项目中引入-xlex"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#在-javascript-项目中引入-xlex"}},[e._v("#")]),e._v(" 在 JavaScript 项目中引入 XLex")]),e._v(" "),a("p",[e._v("XLex 的核心代码不依赖于任何 Node.js 和浏览器环境中的特定的接口，因此用户不仅可以在 Node.js 环境下使用 XLex，也能够在前端页面的项目中引入 XLex。")]),e._v(" "),a("p",[e._v("在你的项目根目录下，输入以下命令，即可引入 XLex。")]),e._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[e._v("npm")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v(" @xlor/xlex\n")])])]),a("h2",{attrs:{id:"原理"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#原理"}},[e._v("#")]),e._v(" 原理")]),e._v(" "),a("p",[e._v("XLex是一个基于"),a("a",{attrs:{href:"https://en.wikipedia.org/wiki/Finite-state_machine",target:"_blank",rel:"noopener noreferrer"}},[e._v("有限状态自动机"),a("OutboundLink")],1),e._v("的词法分析器，它使用词法规则的配置对象（命令行工具中使用动态加载 JavaScript 脚本的形式传入）进行初始化。")]),e._v(" "),a("p",[e._v("XLex 使用一个 "),a("a",{attrs:{href:"https://en.wikipedia.org/wiki/Recursive_descent_parser",target:"_blank",rel:"noopener noreferrer"}},[e._v("递归下降分析器"),a("OutboundLink")],1),e._v(" 来解析配置信息中的 "),a("a",{attrs:{href:"/xlex/reg"}},[e._v("正则表达式")]),e._v("，构建出一个非确定性有限状态自动机，使用子集构造法将其确定化为确定性有限状态自动机，使用 "),a("a",{attrs:{href:"https://en.wikipedia.org/wiki/DFA_minimization#Hopcroft's_algorithm",target:"_blank",rel:"noopener noreferrer"}},[e._v("Hopcroft 算法"),a("OutboundLink")],1),e._v(" 将 DFA 最小化。")]),e._v(" "),a("p",[e._v("XLex 将输入文本串放到最终输出的最小化确定性有限状态自动机上运行，得到 Token 流。运行时，维护每个正则表达式的匹配结点，使用当前字符转移 DFA 状态，直到所有 DFA 都到达了一个非法状态，此时将第一个匹配到的终止结点作为本次的匹配结果，经过可选的回调函数转换后输出到 Token 流中。")])])}),[],!1,null,null,null);t.default=s.exports}}]);