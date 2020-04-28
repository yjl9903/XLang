---
title: XLang 介绍
---

## 介绍

[XLang](https://github.com/yjl9903/XLang) 是一个简单但是足够强大的编程语言，它由词法分析器 [XLex](https://github.com/yjl9903/XLex) 和语法分析器 [XParse](https://github.com/yjl9903/XParse) 驱动。

## 全局安装命令行工具

确保你已经安装并配置 [Node.js 环境](https://nodejs.org/en/)，推荐使用最新的版本的 Node.js。

在终端中输入以下命令，即可安装 XParse。

```bash
npm install -g @yjl9903/xlang
# or
# yarn global add @yjl9903/xlang
```

输入以下命令，确认 XLang 已经成功安装。

```base
xlang --version
```

## 在 JavaScript 项目中引入 XLang

XLang 的核心代码只依赖于 JavaScript 核心代码库，不依赖于特定的运行环境。

在你的项目根目录下，输入以下命令，即可引入 XLang。

```bash
npm install @yjl9903/xlang
# or
# yarn add @yjl9903/xlang
```

## 原理
