---
title: 示例
---

## Hello World

你可以在[实验场](https://xlang.netlify.app/playground)中导入这些例子，运行尝试。

```rust
fn main() {
  println("Hello World!");
}
```

## A + B

从命令行参数中接收两个整数 $a$ 和 $b$，并输出两个数的和。

```rust
fn main(a: number, b: number) {
  println(Number::to_string(a + b));
}
```

## 等差数列求和

递归函数，计算 $\sum_{i=1}^a i$。

```rust
fn cal(a: number) -> number {
  if (a > 1) {
    return a + cal(a - 1);
  } else {
    return a;
  }
}

fn main(a: number) {
  println(Number::to_string(cal(a)));
}
```

## 斐波那契数列

递归计算斐波那契数列，$f(0)=f(1)=1$，$f(n)=f(n-1)+f(n-2)$ $(n \ge 2)$。

```rust
fn fib(a: number) -> number {
  if (a <= 1) {
    return 1;
  } else {
    return fib(a - 1) + fib(a - 2);
  }
}

fn main(a: number) {
  println(Number::to_string(fib(a)));
}
```

使用动态规划的方式，利用数组计算斐波那契数列。

```rust
fn main(a: number) {
  if (a < 0) {
    println("emmmm");
    return ;
  } else if (a <= 1) {
    println("1");
    return ;
  }
  Array::new("fib");
  Array::assign("fib", a + 1);
  Array::set("fib", 0, 1);
  Array::set("fib", 1, 1);
  for (let i = 2; i <= a; i = i + 1) {
    Array::set("fib", i, Array::get("fib", i - 1) + Array::get("fib", i - 2));
  }
  println(Number::to_string(Array::get("fib", a)));
}
```

## 乘法表

生成 $a \times a$ 的乘法表。

```rust
fn getDigit(a: number) -> number {
  if (a == 0) {
    return 1;
  } else if (a < 0) {
    return getDigit(-a);
  }
  let c = 0;
  while (a > 0) {
    c = c + 1;
    a = a / 10;
  }
  return c;
}

fn main(a: number) {
  const aDigit = getDigit(a);
  const mxDigit = getDigit(a * a);
  for (let i = 1; i <= a; i = i + 1) {
    let row = "", spaceI = "";
    for (let k = getDigit(i); k < aDigit; k = k + 1) {
      spaceI = spaceI + " ";
    }
    for (let j = 1; j <= i; j = j + 1) {
      let spaceJ = "";
      for (let k = getDigit(j); k < aDigit; k = k + 1) {
        spaceJ = spaceJ + " ";
      }
      const col = spaceJ + j + " x " + spaceI + i + " = " + (i * j) + " ";
      row = row + col;
      for (let k = getDigit(i * j); k < mxDigit; k = k + 1) {
        row = row + " ";
      }
    }
    println(row);
  }
}
```

## 树上最大独立集

利用 `IO` 库，从输入中读取图，利用数组库使用领接表建出图。

使用树形动态规划的计算一棵树的最大独立集。

```rust
fn dfs(u: number, f: number) {
  const len = Array::length("edge_" + u);
  let s0 = 0, s1 = 1;
  for (let i = 0; i < len; i = i + 1) {
    const v = Array::get("edge_" + u, i);
    if (v != f) {
      dfs(v, u);
      s0 = s0 + Number::max(Array::get("dp0", v), Array::get("dp1", v));
      s1 = s1 + Array::get("dp0", v);
    }
  }
  Array::set("dp0", u, s0);
  Array::set("dp1", u, s1);
}

fn main() {
  const n = In::nextNumber();
  Array::new("dp0");
  Array::assign("dp0", n + 1);
  Array::new("dp1");
  Array::assign("dp1", n + 1);
  for (let i = 1; i <= n; i = i + 1) {
    Array::new("edge_" + i);
  }
  for (let i = 2; i <= n; i = i + 1) {
    const u = In::nextNumber();
    const v = In::nextNumber();
    Array::push("edge_" + u, v);
    Array::push("edge_" + v, u);
  }
  dfs(1, 0);
  println(Number::to_string(Number::max(Array::get("dp0", 1), Array::get("dp1", 1))));
}
```
