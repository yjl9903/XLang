---
title: Hopcroft 算法
---

## Hopcroft 算法

1971 年，Hopcroft 设计了一个最小化确定性有限状态自动机的状态数的高效[算法](http://i.stanford.edu/pub/cstr/reports/cs/tr/71/190/CS-TR-71-190.pdf)。它将 DFA 的状态根据转移行为划分为多个等价类。每个组内的所有 DFA 状态相互之间不可区分，也就是对于所有输入符号有相同的转移行为。

Hopcroft 算法初始时，将 DFA 状态集合划分为接受状态和非接受状态，显然这两个等价类行为不同。然后，运行一个迭代算法，每轮迭代将等价类集合划分为更多且更细化的等价类，这些分割必定是由于等价类中含有不等价的行为，最后无法进行细分时，算法结束。具体地，在一轮迭代中，选出一个等价类 $A$，枚举转移进这个等价类的字符 $c$，枚举其他所有等价类 $Y$ 尝试分割，将 $Y$ 划分为输入 $c$ 转移进 $A$ 和输入 $c$ 无法转移进 $A$ 两类，分别记为 $P$ 和 $Q$，显然 $P$ 和 $Q$ 可能为空集。如果 $P$ 和 $Q$ 不为空，即产生了不等价行为，那么就需要将划分中的 $Y$ 使用 $P$ 和 $Q$ 进行替代。

## 优化和实现

首先给出实现的伪代码。

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.css">
<pseudocode lineNumber lineNumberPunc=" ">
\begin{algorithm}
  \caption{Hopcroft's algorithm}
  \begin{algorithmic}
    \Input{ DFA States $S$, final states $F$ and alphabet $\Sigma$ }
    \Output{ minimum number }
    \PROCEDURE{minimize}{$S, F, \Sigma$}
      \STATE $P \leftarrow \{ F, S - F \}$
      \STATE $WL \leftarrow \{ F, S - F \}$
      \WHILE{ $W$ is not empty }
        \STATE choose and remove a set $A$ from $WL$
        \FOR{$c$ in $\Sigma$}
          \STATE $X \leftarrow$ sets of states which has a transition on $c$ leads to a state in $A$
          \FOR{$Y$ in $P$ and $Y \cap X \neq \varnothing$ and $Y - X \neq \varnothing$}
            \STATE replace $Y$ in $P$ by $Y \cap X$ and $Y - X$
            \IF{$Y$ in $WL$}
              \STATE replace $Y$ in $WL$ by $Y \cap X$ and $Y - X$
            \ELSE
              \IF{ $|Y \cap X| \le |Y - X|$ }
                \STATE add $Y \cap X$ to $WL$
              \ELSE
                \STATE add $Y - X$ to $WL$
              \ENDIF
            \ENDIF
          \ENDFOR
        \ENDFOR
      \ENDWHILE
    \ENDPROCEDURE
  \end{algorithmic}
\end{algorithm}
</pseudocode>

> 伪代码的 $\LaTeX$ 源码见：[pseudocode.tex](https://github.com/yjl9903/XLang/blob/master/docs/deep/pseudocode.tex)。

伪代码没有使用迭代算法，而是也使用了 Worklist 算法的思想，伪代码中的 WL 是一个尝试对等价类进行分割的任务队列。

Worklist 算法在这里关键是找到一些必要的任务加入队列中，对应伪代码的第 $10$ 到 $18$ 行。根据 $Y$ 集合是否存在于任务队列中分类讨论，如果 $Y$ 集合已经在队列中，那么为了保证等价类的信息，显然需要将任务队列中的 $Y$ 集合分裂。$Y$ 集合不在任务队列时的情况略微有些复杂。

给出一个引理：将 $Y$ 分裂成 $P$ 和 $Q$ 两个等价类后，$P$ 和 $Q$ 只需要加入一个进入任务队列就能产生正确的分割结果。

对引理的进行一些说明：考虑一个等价类 $Z$，它本来通过某一个字符转移到等价类 $Y$，但是 $Z$ 的子集 $D$ 的对应字符转移进 $P$，它的另一个子集 $E$ 则转移进 $Q$，也就是 $Y$ 分割为 $P$ 和 $Q$ 导致了 $Z$ 的分割。那么为了分辨 $Z$ 的子集 $D$ 和 $E$，实际上只需要集合 $P$ 和 $Q$ 的任意一个集合，因为不管选择了哪个，$Z$ 分割出来都是属于 $P$ 和不属于 $P$，或者属于 $Q$ 和不属于 $Q$。

有了这个引理，就不难解释第 $13$ 行到第 $17$ 行的判断了。更进一步，我们选择 $P$ 和 $Q$ 中较小的那个加入任务队列。显然，$\min(|P|, |Q|) \le \frac{|S|}{2}$，因此对于任务队列的更新，要么大小不变，要么等价类大小缩小一半。因此，任务队列中的等价类大小会不断缩小为原来的一半。

假设 DFA 的状态数为 $n$，字符集为 $\Sigma$，时间复杂度为 $O(n|\Sigma|\log n)$。在实践中，这篇[论文](https://arxiv.org/pdf/1010.5318.pdf)指出 Hopcroft 算法的平均时间复杂度更优，为 $O(n \log \log n)$。

XLex 的 Hopcroft 算法实现见：[dfa.ts minimize 方法](https://github.com/LonelyKuma/XLex/blob/master/src/reg/dfa.ts#L133)。
