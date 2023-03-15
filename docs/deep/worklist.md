---
title: Worklist 算法
---

## 动机

在数据流分析中，有一个基于迭代算法的分析框架（下图为一个正向 May 数据流分析的算法伪代码）。

<center><img src="/iterative.png" alt="Iterative Algorithm"></center>

> 引用自李樾和谭添老师的 Software Analysis / Static Program Analysis 课程讲义。

这个迭代算法在最坏情况下时间复杂度可能达到答案规模乘一轮迭代的时间，有一个优化就是使用 Worklist 算法。

观察上述算法，每个基本块的 IN 实际上依赖于控制流图的所有前驱结点的 OUT，而这个基本块 OUT 依赖于块内的 GEN/KILL 信息和 IN，因此 OUT 的变化也会依赖于 IN 的变化。

<center><img src="/worklist.png" alt="Worklist Algorithm"></center>

在 Worklist 算法中，我们维护一个任务队列（Worklist），每当一个基本块的 OUT 变化时，他的后继才有可能变化，此时将这些后继放入任务队列中，当任务队列为空时，算法结束，会得到一个与迭代算法相同的结果。

## 启发

Worklist 算法启发了我，在构造 LR(1) 项目集族自动机时也使用了一个迭代算法。

<center><img src="/lr.png" alt="构造 LR(1) 项目集族的算法"></center>

> 引用自《编译原理 - 第二版》。

在求闭包和构造项集时都使用了迭代算法，可以发现都是相同的项目（项目集）产生相同的输出，我们用类似 Worklist 算法的想法也能优化这里构造的迭代算法。
