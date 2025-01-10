---
layout: post
title: A Circulant Matrix + Eigenvectors/values
date: 2015-10-20 11:12:00-0400
description: 
tags: formatting math
categories: math
related_posts: false
---

# 1. Problem
![[Pasted image 20241029213125.png]]
Here is the proposition regarding the eigenvalues of Laplacian Matrix $C_n$
While reading the proof of this proposition, I have encoutered to a question of the following:
![[Pasted image 20241029213250.png]]
the equation 4.6 to 4.8 is pretty straight forward, but it took me some time to understand this part: **If $P$ is a cyclic permutation, then $P\vec{x}$ is also an eigenvector for $\lambda$. This means that $\vec{x}, P\vec{x},...,P^{n-1} \vec{x}$** are all eigenvectors of $\lambda$
I did some of the research what the cyclic permutation is meaning and studying about topics related circulant matrix, which was also very interesting.
So I wanted to write my own proof about this but it is not clear if this is really a "proof" (I am not sure if this proof can be a rigorous proof on this)

Proposition: Let $\vec{x}$ be an eigenvector of $L_{C_n}$. If $P$ is a cyclic permutation, then $P\vec{x}$ is also an eigenvector for $\lambda$. This means that $\vec{x}, P\vec{x},...,P^{n-1} \vec{x}$

The laplacian matrix of $C_n$ has the form
$$\begin{bmatrix}2 & -1 & 0 & ... & -1 \\
-1 & 2 & -1 & ... & 0\\
\vdots &   & \ddots &  & \vdots\\
0 & ... & -1 & 2 & -1\\
-1 & ... & 0 & -1 & 2\\
\end{bmatrix}$$
Then 

I realized it:
next we study **fourier analysis** to understand the rest of the proofs