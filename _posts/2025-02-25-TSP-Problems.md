---
layout: post
title: TSP(s)
date: 2025-02-25
description: 
tags: math TSP
categories: math
related_posts: false
---

# A Brief Intro to the TSP
*A Gentle Intro Optimization* by B. Guenin, J. Konemann and L. Tuncel has introduced the TSP briefly. \\
Consider a traveling salesman who needs to visit cities $$1, 2, 3, ..., n$$ in some order and end up at the city where he started. Cost of travel from city $$i$$ to city $$j$$ is given by $$c_{ij}$$. The goal is to find a *tour* of these $$n$$ cities, visiting city exactly once, such that the total travel costs are minimized. \\ \\
The tour in this problem refers to a Hamiltonian cycle. And it is NP-complete to decide whether a given undirected graph $$G = (V, E)$$ has a Hamiltonian Cycle.

