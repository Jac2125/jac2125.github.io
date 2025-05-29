---
layout: post
title: KnapsackProblem
date: 2025-05-29
description:
tags: math optimization
categories: math Knapsack
related_posts: false
---

# Knapsack Problem - Intro

While going through "The Design of Approximation Algorithm", I encountered an interesting section: The Knapsack Problem.
Well, from **Combinatorial Optimization** by Bernhard Korte & Jens Vygen, the book introduces this problem as “easiest NP-hard problem” compared to the MINIMUM WEIGHT PERFECT MATCHING PROBLEM.

## The Application of Knapsack Problem.

1. Cargo Loading & Container Packing: A shipping company must pack a container or truck under weight/volume limits.
2. Investment Portfolio Selection: An investor allocates a fixed budget among assets or projects to maximize expected return.
3. Project & Budget Selection (Capital Budgeting): A firm chooses which R\&D or capital projects to fund within its available capital.
4. Advertisement Slot Scheduling: An online platform fills limited ad slots (time or impressions) to maximize ad revenue.
5. Cloud Computing Resource Allocation: A data center assigns virtual machines to servers under CPU/memory/energy constraints.
   –– Answered by ChatGPT

## Problem (Simplified Version)

A traveler with a knapsack comes across a treasure hoard. Unfortunately, his knapsack can hold only so much. What items should he place in his knapsack in order to maximize the value of the items he takes away?

**Problem Definition**
Given a set of $n$ items
$I = \{1,2,\dots,n\},$
where each item $i\in I$ has

* weight $w_i > 0$
* value $v_i > 0$

and given a knapsack capacity $W > 0$, find a subset $S \subseteq I$ such that

$$
\sum_{i \in S} w_i \;\le\; W
$$

and the total value

$$
\sum_{i \in S} v_i
$$

is maximized.

## DP Solution

This problem can be solved using Dynamic Programming by computing, for each prefix of items and each weight limit, the maximum achievable value.

Define

$$
f(i,w) \;=\; \max\Bigl\{\sum_{j\in S} v_j \;\big|\; S\subseteq\{1,\dots,i\},\;\sum_{j\in S} w_j \le w\Bigr\}.
$$

Initialize

$$
f(0,w) = 0 \quad\forall\,0\le w\le B.
$$

Then for $i=1,\dots,n$ and $0\le w\le B$:

$$
f(i,w) = 
\begin{cases}
f(i-1,w), & w_i > w,\\
\displaystyle\max\bigl(f(i-1,w),\,f(i-1,w - w_i) + v_i\bigr), & w_i \le w.
\end{cases}
$$

The optimal value is $f(n,B)$.
This runs in

$$
O(nB).
$$

Equivalently, one can do a value-based DP:

$$
g(i,v) \;=\; \min\Bigl\{\sum_{j\in S} w_j \;\big|\; S\subseteq\{1,\dots,i\},\;\sum_{j\in S} v_j \ge v\Bigr\},
$$

which yields running time

$$
O(nV).
$$

Hence overall time complexity is

$$
O\bigl(n\min\{B,V\}\bigr).
$$

## Rounding Solution

To obtain a Fully Polynomial-Time Approximation Scheme (FPTAS), proceed as follows:

1. Let $v_{\max} = \max_i v_i$ and choose

   $$
   K = \frac{\varepsilon\,v_{\max}}{n}.
   $$
2. Define scaled values

   $$
   v_i' = \left\lfloor \frac{v_i}{K} \right\rfloor \quad\forall i.
   $$
3. Run the value-based DP on $v_i'$ instead of $v_i$.
   This produces a solution whose total original value is at least $(1-\varepsilon)$ times optimum.

The running time is

$$
O\Bigl(n\sum_{i=1}^n v_i'\Bigr)
= O\Bigl(n\cdot \frac{\sum_i v_i}{K}\Bigr)
= O\Bigl(\tfrac{n^2\,v_{\max}}{\varepsilon\,v_{\max}}\Bigr)
= O\bigl(\tfrac{n^2}{\varepsilon}\bigr).
$$

With more careful implementation one can achieve

$$
O\Bigl(\tfrac{n^3}{\varepsilon}\Bigr)
$$

or even

$$
O\Bigl(\tfrac{n^2}{\varepsilon}\Bigr)
$$

depending on how the DP is structured.

I have made a Knapsack Calculator here: 
<iframe
  src="{{ site.baseurl }}/assets/webProject/Knapsack/index.html"
  width="100%"
  height="600"
  style="border:1px solid #ccc; border-radius:4px;"
  sandbox="allow-scripts allow-same-origin"
>
  당신의 브라우저가 iframe을 지원하지 않습니다.
</iframe>