---
layout: post
title: TraffifOptimization
date: 2025-05-18
description: 
tags: math optimization
categories: math
related_posts: false
---

# Problem
One day I started to wonder how korean traffic lights are working. Usually, traffic light turns to red to let the passengers cross the road.
But it alternates from red light to green light even when there is no passenger crossing the road, and the cars are waiting it to show them a pretty green circle.

Assuming that we know the random variable $$X_r$$, a number of cars passing the road $$r$$, and a traffic function $$f(x)$$ which tells how many seconds a car would take to pass the road based on the number of cars on the road, denoted by $$x$$.
**These factors are not gonna be added at this point, I will start with a simplified version of this problem**

What we need to do is to minimize the sum of each car's arrival time.
In other words, let $$c_i$$ be the ith car, where $$i \in \{1,...,n\}$$ and ach car $$c_i$$ has arrival time $$t_i > 0$$. If time of arrival is $$0$$, we treat that as trivial case as it does not have to move at all.
Our goal is to minimize $$\Sum_{i = 0}^{n} t_i$$

## Intuition
My first intuition tells me to build a graph and optimize the flow.
Let $$G=(V,E)$$ be a graph, where $$V$$ is a node cars starting there journey and $$E$$ be a road.
Each car $$c_i$$ has $$s_i$$ and $$f_i$$, starting node and finishing node respectfully.
Also we are assuming there always exist a path from $$s_i$$ to $$f_i$ for all $$i \in \{1, ..., n\}$$

Each edge $$e_j \in E$$, where $$j \in {1, ..., m\}$$ has a maximum capacity $$R_i \in \mathbb{N}$$, and a weight $$w_i > 0$$ which tells how many miniutes/seconds a car takes to pass the road.

Lastly, each node has a traffic light $$L_v$$

we could construct a problem and apply an algorithm to solve it.

## Formalize Porblem
I would like to start with a simplified version of this problem.
Instead of letting cars start at multiple nodes, fix the starting node and the finshing node. 
