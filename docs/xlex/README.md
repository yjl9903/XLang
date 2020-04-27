---
title: XLex 介绍
---

## 介绍

XLex 是一个词法分析器工具，它在设计时一定程度上借鉴了 [Flex](https://github.com/westes/flex/)。你可以使用它构造自己的词法分析规则，并用它来分析输入的代码文本串，生成 [Token 流](https://en.wikipedia.org/wiki/Lexical_analysis#Token)。XLex 借助 JavaScript 脚本允许你对分析过程做更多的定制。

XLex 为用户提供了命令行工具和 JavaScript 编程接口两种使用方式。你可以直接通过创建默认名为 `xlex.config.js` 的配置文件（脚本），来构造你自己的词法规则，并使用命令行工具导入配置文件并解析代码文本串。同时，你也可以在 JavaScript 项目中引入 XLex，传入配置对象来创建一个词法分析器。

## 全局安装命令行工具

确保你已经安装并配置 [Node.js 环境](https://nodejs.org/en/)，推荐使用最新的版本的 Node.js。

在终端中输入以下命令，即可安装 XLex。

```bash
npm install -g xlex
# or
# yarn global add xlex
```

输入以下命令，确认 XLex 已经成功安装。

```base
xlex --version
```

## 在 JavaScript 项目中引入 XLex

XLex 的核心代码不依赖于任何 Node.js 和浏览器环境中的特定的接口，因此用户不仅可以在 Node.js 环境下使用 XLex，也能够在前端页面的项目中引入 XLex。

在你的项目根目录下，输入以下命令，即可引入 XLex。

```bash
npm install xlex
# or
# yarn add xlex
```

## 原理

[XLex](https://github.com/yjl9903/XLex) 是一个基于[有限状态自动机](https://en.wikipedia.org/wiki/Finite-state_machine)的词法分析器，它使用词法规则的配置对象（命令行工具中使用动态加载 JavaScript 脚本的形式传入）进行初始化。

XLex 使用一个 [递归下降分析器](https://en.wikipedia.org/wiki/Recursive_descent_parser) 来解析配置信息中的 [正则表达式](/xlex/reg)，构建出一个非确定性有限状态自动机，使用子集构造法将其确定化为确定性有限状态自动机，使用 [Hopcroft 算法](https://en.wikipedia.org/wiki/DFA_minimization#Hopcroft's_algorithm) 将 DFA 最小化。

XLex 将输入文本串放到最终输出的最小化确定性有限状态自动机上运行，得到 Token 流。运行时，维护每个正则表达式的匹配结点，使用当前字符转移 DFA 状态，直到所有 DFA 都到达了一个非法状态，此时将第一个匹配到的终止结点作为本次的匹配结果，经过可选的回调函数转换后输出到 Token 流中。
