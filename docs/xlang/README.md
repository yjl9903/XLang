---
title: XLang 介绍
---

## 介绍

[XLang](https://github.com/yjl9903/XLang) 是一个简单但是足够强大的编程语言，它由词法分析器 [XLex](https://github.com/yjl9903/XLex) 和语法分析器 [XParse](https://github.com/yjl9903/XParse) 驱动。

XLang 使用了一个由 TypeScript 编写的虚拟机来执行其代码，你可以下载并安装其命令行工具在本地编译和运行你的代码。

XLang 提供了一个在线[实验场](https://xlang.netlify.app/)，你可以在上面尝试使用 XLang，XLex 和 XParse。

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

XLang 使用 XLex 作为词法分析器，得到 Token 流后，输入进语法分析器 XParse 中，XParse 解析 Token 流的语法结构，并使用综合属性维护出代码的抽象语法树。在抽象语法树上进行遍历，维护作用域符号表，当前编译的函数等信息。XLang 设计了一个简单的[三地址码](/xlang/deep)中间表示，在遍历抽象语法树时，进行代码生成的工作。

XLang 实现的虚拟机可以执行生成的三地址码。虚拟机在执行时，维护了当前要执行的三地址码位置，全局变量，函数调用栈，存储局部变量的栈，实现了 XLang 代码的模拟执行。虚拟机还绑定了一些由 JavaScript 编写的[内置函数](/xlang/fn)，也允许你通过命令行程序导入自己编写 JavaScript 模块，提供接口给 XLang 调用。
