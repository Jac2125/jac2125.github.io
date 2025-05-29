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
While going through "The Design of Approximation Algorithm", I encountered an interesting section: The Knapsack Problem

## Problem (Simplified Version)
A traveler with a knapsack comes across a treasure hoard. Unfortunately, his knapsack can hold only so much. What items should he place in his knapsack in order to maximize the value of the items he takes away?

**Problem Definition**  
Given a set of \(n\) items \(I = \{1,2,\dots,n\}\), where each item \(i\in I\) has  
- weight \(w_i > 0\)  
- value \(v_i > 0\)  

and given a knapsack capacity \(W > 0\), find a subset \(S \subseteq I\) such that
\[
\sum_{i \in S} w_i \;\le\; W
\]
and the total value
\[
\sum_{i \in S} v_i
\]
is maximized.  
