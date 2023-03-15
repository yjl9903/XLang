---
title: 原理和设计
---

## 抽象语法树

在使用 XParse 进行 LR 分析时，通过计算综合属性的方式求出抽象语法树。

使用一个类 `BasicASTNode` 定义了抽象语法树结点的基类，拥有虚函数 `visit(context: Context): NodeVisitorReturn`。

有具体抽象语法树结点：

+ `RootASTNode`：程序根结点；

+ `FunctionASTNode`：函数定义结点；

+ `StatementListASTNode`：程序语句列表结点；

+ `IfStatementASTNode`：`if` 语句结点；

+ `WhileStatementASTNode`：`while` 语句结点；

+ `ForStatementASTNode`：`for` 语句结点；

+ `DefineListASTNode`：变量声明语句列表结点；

+ `DefineASTNode`：变量声明；

+ `ArgDefineListASTNode`：函数参数列表结点；

+ `LeafASTNode`：具体变量或常量值结点；

+ `BinOPASTNode`：二元操作符结点；

+ `UnitOPASTNode`：一元操作符结点。

+ `FunctionCallASTNode`：函数调用语句结点；

+ `FunctionReturnASTNode`：函数返回语句结点。

这些结点均实现了在遍历抽象语法树的递归访问函数 `visit(context: Context): NodeVisitorReturn`，其中 `context` 包含当前访问位置的上下文信息，包含符号表，全局函数和当前编译的函数。

为了实现作用域的切换，符号表形成了一个链表的结构，每个作用域的符号表有一个指针指向上层符号表，每个符号表使用一个哈希表实现。在查询具体符号时，会在当前作用域中的哈希表查找，若找不到会继续在上层递归查找。符号表的具体实现见 symbolTable.ts。

访问函数都会返回一个对象，包含两个属性。`code` 属性存放当前结点生成出来的代码，`dst` 属性存放这个结点返回值的变量或常量信息，包含它的类型，内存相对地址等信息。

## 三地址码

孤独熊熊的三地址码支持以下指令：

`NOP`，`FunctionCall`，`FunctionReturn`，`PushStack`，`Goto`，`IfGoto`，`Plus`，`Minus`，`Mul`，`Div`，`Mod`，`Negative`，`Not`，`And`，`Or`，`NotEqual`，`Equal`，`LessThan`，`MoreThan`，`LessOrEqual`，`MoreOrEqual`，`Assign`。

更详细和完整的三地址码类型定义见 tac.ts，以及类型推断的定义。

这些三地址码指令可以分为 $5$ 类。

+ 函数调用相关：`FunctionCall`，`FunctionReturn` 处理函数调用，`PushStack` 处理函数参数的传递；

+ 控制流跳转：`Goto`，`IfGoto`；

+ 数值计算相关：`Plus`，`Minus` 等；

+ 内存赋值：`Assign`；

+ 空操作：`NOP`。

## 虚拟机

虚拟机维护了当前要执行的三地址码位置，全局变量，函数调用栈，存储局部变量的栈。

在函数调用的过程中，维护了函数的调用栈，包含上层函数的现场信息（栈指针，程序指令指针，调用函数名等），还维护了局部变量的内存栈（如下图所示）。

<center><img src="/stack.png" alt="stack"></center>

栈指针指向了当前函数调用的局部变量最低地址，而栈指针前存放的是调用这个函数传进来的实际参数。

在函数调用前，使用 `PushStack` 指令将参数传入调用函数。

对于控制流指令，使用相对地址进行跳转。
