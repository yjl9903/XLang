---
title: 使用 XParse 命令行工具
---

## 获取帮助

在终端中输入以下命令，即可查看命令行工具的帮助。

```bash
xparse --help
```

[XParse v1.1.0](https://www.npmjs.com/package/@yjl9903/xparse) 的帮助内容如下所示。

```text
XParse v1.1.0

Usage:
  $ XParse

Commands:
  build  Build LR Parser
         Run LR Parser

For more info, run any command with the `--help` flag:
  $ XParse build --help
  $ XParse --help

Options:
  --config <config>  Config file path (default: xparse.config)
  -h, --help         Display this message
  -v, --version      Display version number
```

## 解析 Token 流

在终端的工作目录下，创建 JavaScript 脚本文件 `xparse.config.js`（默认名称，你也可以使用手动指定文件）。

我们首先使用 XLex 和 [使用 XLex 命令行工具](/xlex/usage.html#解析代码文本串) 中的词法规则作为词法分析器，然后构造一个简单的语法规则，用于解析一个简单的整数算术表达式。

当然，XParse 的实现和 XLex 没有任何关系，你也可以使用自己代码向 XParse 提供 Token 流，只要符合 XParse 接收 Token 的规则即可（Token 对象类型见 [使用 XLex 命令行工具](/xlex/usage.html#解析代码文本串) 中的输出结果描述）。

```js
module.exports = {
  hooks: {},
  tokens: [
    'Number',
    'Plus',
    'Minus',
    'Mul',
    'Div',
    'LRound',
    'RRound',
  ],
  types: [
    'calculator',
    'term',
    'factor'
  ],
  start: 'calculator',
  productions: [
    {
      left: 'calculator',
      right: [
        {
          rule: [
            'term', 'Plus', 'calculator'
          ],
          reduce(l, m, r) {
            return l + r;
          }
        },
        {
          rule: [
            'term', 'Minus', 'calculator'
          ],
          reduce(l, m, r) {
            return l - r;
          }
        },
        {
          rule: [
            'term'
          ],
          reduce(value) {
            return value;
          }
        }
      ]
    },
    {
      left: 'term',
      right: [
        {
          rule: [
            'factor', 'Mul', 'term'
          ],
          reduce(l, m, r) {
            return l * r;
          }
        },
        {
          rule: [
            'factor', 'Div', 'term'
          ],
          reduce(l, m, r) {
            return l / r;
          }
        },
        {
          rule: [
            'factor'
          ],
          reduce(value) {
            return value;
          }
        }
      ]
    },
    {
      left: 'factor',
      right: [
        {
          rule: [
            'Plus', 'Number'
          ],
          reduce(m, { value }) {
            return value;
          }
        },
        {
          rule: [
            'Minus', 'Number'
          ],
          reduce(m, { value }) {
            return -value;
          }
        },
        {
          rule: [
            'Number'
          ],
          reduce({ value }) {
            return value;
          }
        },
        {
          rule: [
            'LRound', 'calculator', 'RRound'
          ],
          reduce(l, value) {
            return value;
          }
        }
      ]
    }
  ]
};
```

关于配置脚本的编写：

+ 你必须使用 [CommonJS](http://www.commonjs.org/) 规范，将配置对象作为模块进行导出；

+ 配置对象包含五个属性（类型定义见 [type.ts](https://github.com/yjl9903/XParse/blob/master/src/LRparser/type.ts#L22)）：

  + `hooks`：可选项，配置语法分析的预处理和后处理钩子函数，你可以定义 `beforeCreate()` 和 `created()` 两个函数；

  + `tokens`：必选项，指定产生式中哪些是终结符；

  + `types`：必选项，指定产生式中哪些是非终结符；

  + `start`：必选项，指定文法的开始非终结符；

  + `productions`：必选项，配置所有文法规则，包含一个产生式数组，每个对象包含以下属性：

    + `left`：产生式左部，一个字符串，必须是一个非终结符；

    + `right`：产生式右补，包含多个具体的产生式规则，每个对象包含以下属性：

      + `rule`：产生式规则，是一个字符串数组，每个字符串代表一个终结符或者非终结符，特别地，空数组代表产生式右部为 ε；

      + `reduce()`：可选项，使用该产生式规约时计算综合属性的回调函数，XParse 会自动按照产生式中的顺序传入综合属性值作为参数，其中终结符传入的是词法值，非终结符是计算的综合属性值。

保存配置脚本。XParse 从标准输入中读取 JSON 格式 Token 数组字符串，你可以按照对应格式手动编写，但是推荐使用 XLex 通过管道将输出定向到 XParse 的输入中。命令示例：

Linux 终端或 Windows 控制台：

```bash
xlex < code.txt | xparse
```

Windows PowerShell：

```powershell
Get-Content code.txt | xlex | xparse
```

表达式 `1 + 2 * (3 + 4)` 的输出结果为：

```json
{ ok: true, value: 15 }
```

成功时，输出一个对象，包含属性 `ok`，值为 `true`，以及属性 `value` 包含最终根节点的综合属性值。

表达式 `1 + 2 * (3  4)` 的输出结果为：

```json
{
  ok: false,
  token: {
    type: 'Number',
    value: 4,
    position: { row: 0, col: 12, length: 1 }
  }
}
```

失败时，输出一个对象，包含属性 `ok`，值为 `false`，以及属性 `token` 或 `message` 表示发生错误的位置或错误信息。
