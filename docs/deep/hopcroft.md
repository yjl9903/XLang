---
title: Hopcroft 算法
---

## Hopcroft 算法

1971 年，Hopcroft 设计了一个最小化确定性有限状态自动机的状态数的高效[算法](http://i.stanford.edu/pub/cstr/reports/cs/tr/71/190/CS-TR-71-190.pdf)。它将 DFA 的状态根据转移行为划分为多个等价类。每个组内的所有 DFA 状态相互之间不可区分，也就是对于所有输入符号有相同的转移行为。

Hopcroft 算法初始时，将 DFA 状态集合划分为接受状态和非接受状态，显然这两个等价类行为不同。然后，运行一个迭代算法，每轮迭代将等价类集合划分为更多且更细化的等价类，这些分割必定是由于等价类中含有不等价的行为，最后无法进行细分时，算法结束。具体地，在一轮迭代中，选出一个等价类 $A$，枚举转移进这个等价类的字符 $c$，枚举其他所有等价类 $Y$ 尝试分割，将 $Y$ 划分为输入 $c$ 转移进 $A$ 和输入 $c$ 无法转移进 $A$ 两类，分别记为 $P$ 和 $Q$，显然 $P$ 和 $Q$ 可能为空集。如果 $P$ 和 $Q$ 不为空，即产生了不等价行为，那么就需要将划分中的 $Y$ 使用 $P$ 和 $Q$ 进行替代。

## 伪代码

<center><img src="/hopcroft.png" alt="Hopcroft's Algorithm"></center>

伪代码的 $\LaTeX$ 源码见：[pseudocode.tex](https://github.com/yjl9903/XLang/blob/master/docs/deep/pseudocode.tex)。

XLex 的 Hopcroft 算法实现见：[dfa.ts minimize 方法](https://github.com/yjl9903/XLex/blob/master/src/reg/dfa.ts#L133)。
