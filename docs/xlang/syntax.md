---
title: 语法
---

## 程序入口

一个孤独熊熊的代码，必须包含 `main` 函数，作为程序的入口点。

```rust
fn main() {
  // main entry...
}
```

`main` 函数还允许你定义一些参数。

```rust
fn main(n: number, str: string) {
  // main entry...
}
```

这些参数可以传入给孤独熊熊的命令行，在代码编译完成，即将运行时，会自动转换成相应的类型，传入 `main` 函数中。

## 变量声明

孤独熊熊允许两种变量声明的方式，一种是声明可变变量 `let`，另一种是声明不可变变量 `const`。

```typescript
let a = 1, c = true;
const b = "immutable";
```

没有声明类型？习惯 `C/C++` 和 `Java` 等语言风格的人会对此感到困惑。

同 `TypeScript`，`Rust` 等语言一样，孤独熊熊会自动推导出 `a` 的类型是整数，`b` 的类型是字符串。

孤独熊熊中内置的数据类型有 `number`，`float`，`string`，`bool` 四种。

你也手动指定出一个变量的类型，在通常情况下这并不是必要。

```typescript
let a: number = 1;
const b: string = "immutable";
```

使用可变变量声明时，若没有初始值，则它的类型会在首次赋值时确定。

使用不可变变量声明时，必须初始化。

如果同时使用了初始化和类型声明，你必须保证类型是兼容的。

```typescript
let a;
const b: string; // Error: const variable b is not initialized
const c: number = "123"; // Error: variable c's type not match
const d = a; // Error: variable a is not initialized
```

局部变量的声明存在块状的作用域。

```typescript
{
  const a = 1;
  {
    const b = a + 1;
  }
  const c = b + 1; // Error: variable b is not defined
}
```

## 流程控制

类似于 `C/C++` 和 `JavaScript` 等语言，你可以写以下这些流程控制语句。

```javascript
if (a > 1) {
  // code here...
} else if (a > 0) {
  // code here...
} else {
  // code here...
}

let i = 0;
while (i < 10) {
  // code here...
}

for (let i = 0; i < 10; i = i + 1) {
  // code here...
}
```

注意所有条件判断必须返回 `bool` 类型，孤独熊熊不会将数字等类型隐式转换为 `bool`。

## 函数声明

在函数体外，你可以声明全局作用域的函数。

使用关键字 `fn` 开头声明一个函数，圆括号内写参数列表，这里参数必须显式地指明数据类型。

如果函数有返回值，你必须在后面用箭头 `->` 标出返回类型。否则，你可以省略这个声明。

```rust
fn hello() {
  println("Hello");
}

fn cal(a: number) -> number {
  return a + 1;
}
```

孤独熊熊在代码生成的过程中，会对有返回值的函数的返回情况做粗略的检查。

在下面的情况中，可能存在一个分支没用返回值，这将无法通过孤独熊熊的编译。

```rust
fn cal(a: number) -> number {
  if (a > 0) {
    return 0;
  } else {
    println("not return"); // Error: function "cal" does not have Return statement
  }
}
```
