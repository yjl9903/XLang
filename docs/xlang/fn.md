---
title: 内置函数
---

## 内置函数

孤独熊熊提供了 JavaScript 编写的内置函数。

你也可以使用命令行工具导入自己的接口。

编写 `lib.js`，导出一个模块，其中属性 `lib` 包含一个绑定对象的数组。

例如，下面就是绑定了一个名为 `hello`，返回值是 `void` 的无参数函数，作用是输出 `Hello World!`。

```js
module.exports = {
  lib: [
    {
      name: 'hello',
      type: 'voidType',
      args: [],
      fn: () => (console.log('Hello World!'))
    }
  ]
}
```

编写 `test.xl`，使用命令 `onekuma test.xl --lib lib.js` 运行孤独熊熊脚本。

```rust
fn main() {
  hello();
  // print "Hello World!" to console
}
```

## IO

孤独熊熊不仅支持传入命令行参数，还支持读取文件的输入。

### `In::hasNext()`

判断是否还有输入。

### `In::nextNumber()`

获取输入文件中下一个整数。

### `In::nextFloat()`

获取输入文件中下一个浮点数。

### `In::nextBool()`

获取输入文件中下一个布尔值。

## 字符串

支持各种字符串操作的内置函数。

### `String::length(s: string)`

获取字符串 $s$ 的长度。

### `String::get(s: string, id: number)`

获取字符串 $s$ 的 $id$ 位置的字符。

### `String::to_number(s: string)`

将字符串 $s$ 转换为数字。

### `String::to_float(s: string)`

将字符串 $s$ 转换为浮点数。

## 数字

支持各种整数操作的内置函数，浮点数也有类似的函数（除了随机数）。

### `Number::to_string(a: number)`

将整数 $a$ 转换为字符串。

### `Number::max(a: number, b: number)`

获取整数 $a$ 和 $b$ 的最大值。

### `Number::min(a: number, b: number)`

获取整数 $a$ 和 $b$ 的最小值。

### `Number::abs(a: number)`

获取整数 $a$ 的绝对值。

### `Number::rand(l: number, r: number)`

在 $[l,r]$ 范围内随机一个整数。

### `Float::floor(a: float)`

获取浮点 $a$ 的下取整。

### `Float::round(a: float)`

获取浮点 $a$ 的四舍五入结果。

### `Float::ceil(a: float)`

获取浮点 $a$ 的上取整。

### `Float::sqrt(a: float)`

获取浮点数 $a$ 的根号。
