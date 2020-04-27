---
title: 使用 XLex 命令行工具
---

## 获取帮助

在终端中输入以下命令，即可查看命令行工具的帮助。

```bash
xlex --help
```

[XLex v1.4.1](https://www.npmjs.com/package/xlex) 的帮助内容如下所示。

```text
XLex v1.4.0

Usage:
  $ XLex

Commands:
  draw <reg> [name]  Draw DAG of the RegExp
                     Generate Token

For more info, run any command with the `--help` flag:
  $ XLex draw --help
  $ XLex --help

Options:
  --config <config>  Config file path (default: xlex.config)
  -h, --help         Display this message
  -v, --version      Display version number
```

## 正则表达式绘图

请确保你的计算机已经安装了 [Graphviz](https://www.graphviz.org/)。

在终端中输入以下命令，即可得到正则表达式 `abc` 的图片。

```bash
xlex draw abc
```

你会在当前工作目录下得到一个名为 `RegExp.svg` 的图片，如下图所示。

<center><img src="/RegExp.svg" alt="RegExp"></center>

## 解析代码文本串

在终端的工作目录下，创建 JavaScript 脚本文件 `xlex.config.js`（默认名称，你也可以使用手动指定文件）。

接下来构造一个简单的词法规则，用于解析一个简单的整数算术表达式。

```js
module.exports = {
  tokens: [
    {
      type: 'Number',
      rule: '[0-9]+',
      callback({ type, value }) {
        return {
          type,
          value: Number.parseInt(value)
        };
      }
    },
    {
      type: 'Plus',
      rule: '\\+'
    },
    {
      type: 'Minus',
      rule: '-'
    },
    {
      type: 'Mul',
      rule: '\\*'
    },
    {
      type: 'Div',
      rule: '/'
    },
    {
      type: 'LRound',
      rule: '\\('
    },
    {
      type: 'RRound',
      rule: '\\)'
    }
  ]
};
```

关于配置脚本的编写：

+ 你必须使用 [CommonJS](http://www.commonjs.org/) 规范，将配置对象作为模块进行导出；

+ 配置对象包含两个属性：

  + `hooks`：可选项，配置词法分析的预处理和后处理钩子函数，你可以定义 `beforeCreate()` 和 `created()` 两个函数；

  + `tokens`：必选项，词法规则对象数组，每个对象包含以下属性：

    + `type`：Token 的名称；

    + `rule`：Token 的正则表达式规则；

    + `callback`：可选项，解析到这类 Token 时触发的回调函数，你可以在这里编写一些数据转换逻辑或者错误处理。它接受一个对象作为参数，包含两个属性，`type` 表示该 Token 的名称，`value` 表示该 Token 对应的真实字符串。你的回调函数也应该返回该类型的对象。

保存配置脚本，创建一个纯文本文件（假定名称为 `code.txt`），编辑你的代码文件。例如：

```text
1 + 2 * (3 + 4)
```

现在，你只需要在终端中运行 `xlex` 命令，并将这个文件重定向到该命令的标准输入流中即可。命令示例：

Linux 终端或 Windows 控制台：

```bash
xlex < code.txt
```

Windows PowerShell：

```powershell
Get-Content code.txt | xlex
```

输出结果：

```json
[
  {
    "type": "Number",
    "value": 1,
    "position": {
      "row": 0,
      "col": 0,
      "length": 1
    }
  },
  {
    "type": "Plus",
    "value": "+",
    "position": {
      "row": 0,
      "col": 2,
      "length": 1
    }
  },
  {
    "type": "Number",
    "value": 2,
    "position": {
      "row": 0,
      "col": 4,
      "length": 1
    }
  },
  {
    "type": "Mul",
    "value": "*",
    "position": {
      "row": 0,
      "col": 6,
      "length": 1
    }
  },
  {
    "type": "LRound",
    "value": "(",
    "position": {
      "row": 0,
      "col": 8,
      "length": 1
    }
  },
  {
    "type": "Number",
    "value": 3,
    "position": {
      "row": 0,
      "col": 9,
      "length": 1
    }
  },
  {
    "type": "Plus",
    "value": "+",
    "position": {
      "row": 0,
      "col": 11,
      "length": 1
    }
  },
  {
    "type": "Number",
    "value": 4,
    "position": {
      "row": 0,
      "col": 13,
      "length": 1
    }
  },
  {
    "type": "RRound",
    "value": ")",
    "position": {
      "row": 0,
      "col": 14,
      "length": 1
    }
  }
]
```

输出内容是一个 `JSON` 格式的对象数组，每个对象包含 3 个属性。

+ `type`：Token 名称；

+ `value`：Token 的词法值；

+ `position`：Token 出现的行号，列号，以及字符串的长度（回调函数调用前）。
