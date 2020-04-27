---
title: XParse 介绍
---

## 介绍

[XParse](https://github.com/yjl9903/XParse) 是一个语法分析器工具，你可以构造自己的语法分析规则，添加文法的综合属性语法制导翻译方案，用它来分析 Token 流的语法（推荐使用 XLex 作为 Token 流的生产者），输出 Token 流是否为满足你设计文法的合法代码串，以及语法分析树根节点的综合属性值。

## 全局安装命令行工具

确保你已经安装并配置 [Node.js 环境](https://nodejs.org/en/)，推荐使用最新的版本的 Node.js。

在终端中输入以下命令，即可安装 XParse。

```bash
npm install -g @yjl9903/xparse
# or
# yarn global add @yjl9903/xparse
```

输入以下命令，确认 XParse 已经成功安装。

```base
xparse --version
```

## 在 JavaScript 项目中引入 XParse

同 XLex 一样，XParse 的核心代码只依赖于 JavaScript 核心代码库，不依赖于特定的运行环境。

在你的项目根目录下，输入以下命令，即可引入 XParse。

```bash
npm install @yjl9903/xparse
# or
# yarn add @yjl9903/xparse
```

## 原理

XParse 是一个基于自底向上 [LR(1) 技术](https://en.wikipedia.org/wiki/LR_parser) 的语法分析器，它使用语法规则的配置对象（命令行工具中使用动态加载 JavaScript 脚本的形式传入）进行初始化。

XParse 使用配置对象中的文法产生式，将其转换为增广文法后，构造 LR(1) 项目集族，生成项目集族的有限状态自动机，使用项目集族构造出规范 LR(1) 语法分析表（ACTION - GOTO 表）。

使用 ACTION - GOTO 表，运行 LR 语法分析器，在维护项目集族的状态栈的同时，还维护了综合属性值的栈。在使用产生式规约时，将栈顶的综合属性值取出，传入综合属性的处理回调函数中，生成新的属性值推入栈中。最终，语法分析成功时，将栈顶元素（此时栈中只有一个元素）取出作为输出。
