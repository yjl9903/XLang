---
title: 正则表达式
---

## 正则表达式

XLex 实现了一个简易的正则表达式。

## 语法规则

正则表达式由所有可显示的 ASCII 码字符，和一些运算符组成。

初始时，匹配的字符串为空串。

合法的运算符包括：

+ 连接：将一个正则表达式和一个字符进行连接，例如 `Sa`，表示正则表达式 `S` 后面必须匹配小写英文 `a`；

+ 或：匹配两个正则表达式中的一个，例如 `S|T`，表示字符串必须匹配正则表达式 `S` 或者正则表达式 `T`；

+ 闭包：`S*`，表示匹配零个或多个正则表达式 `S`；

+ 正闭包：`S+`，类似于闭包，但是至少匹配一次 `S`；

+ 可选：`S?`，表示匹配零个或一个正则表达式 `S`；

+ 括号：`(S)`，用于改变运算符优先级；

+ 范围选择：`[...]`，用一对方括号包裹起来，用于匹配一个内部的所有字符。例如，`[abc]` 表示匹配小写英文字母 `a` 或 `b` 或 `c`；例如，`[a-z0-9]` 表示匹配一个所有小写英文字母或者数字。

范围选择和括号的优先级最高，其次是闭包和正闭包和可选，再其次是连接，或的优先级最低。

## LL(1) 文法

```text
EXPR -> TERM EXPR_REST
EXPR_REST -> ε
EXPR_REST -> | EXPR

TERM -> TERM TERM_REST
TERM_REST -> ε
TERM_REST -> TERM

TERM -> FACTOR TERM_SUFFIX
TERM_SUFFIX -> ε
TERM_SUFFIX -> *
TERM_SUFFIX -> +
TERM_SUFFIX -> ?

FACTOR -> <ASCII 码字符>
FACTOR -> [ RANGE ]
FACTOR -> ( EXPR )
FACTOR -> \ <转义字符>

RANGE -> RANGE_ITEM RANGE_REST
RANGE_REST -> ε
RANGE_REST -> RANGE
RANGE_ITEM -> <ASCII 码字符> RANGE_ITEM_REST
RANGE_ITEM_REST -> ε
RANGE_ITEM_REST -> - <ASCII 码字符>
```

XLex 使用一个递归下降分析器解析正则表达式，具体实现为 [parser.ts](https://github.com/LonelyKuma/XLex/blob/master/src/reg/parser.ts)。
