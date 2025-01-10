---
layout: post
title: A Brief Intro to Spectral Graph Theory
date: 2015-10-20 11:12:00-0400
description: 
tags: formatting math
categories: math
related_posts: false
---

# 3.1 Basic Properties of the Laplacian Matrix
> [!Definition 3.1]
> Suppose $G = (V,E)$ is a graph with $V = {1,2,...,n}$. For an edge ${u, v} \in E$, we define an $n \times n$ matrix $L_{G_{\{u,v\}}}$ by
> $$l_{G_{(u,v)}}(i,j) = \begin{cases} 1 & \text{if } i = j \text{ and } i \in \{u,v\}, \\ 
-1 & \text{if } i = u \text{ and } j = v, \text{ or vice versa,} \\ 
0 & \text{otherwise.} 
\end{cases}$$

> [!Definition 3.2]
> For a graph $G = (V, E), L_G = \sum_{\{u, v\} \in E} L_{G_\{u, v\}}$

### Theorem 3.3
The eigenvalues of a self adjoint matrix are all real
*proof.* Suppose $\lambda$ is an eigenvalue of the self adjoint matrix $L$ and $v$ is a nonzero eigenvector of $\lambda$. 
$$ \begin{align*} \lambda||v||^2 &= \lambda\langle v,v \rangle \\ &= \langle \lambda v,v \rangle \end{align*} 
$$
> [!Definition 3.4]
> An $n \times n$ matrix $M$ is called positive-semidefinite if $\underline{x}^{T}M\underline{x} \geq 0$ for all $\underline{x} \in \mathbb{R}^n$ 

## Theorem 3.5
For a graph $G$, every eigenvalue of $L_G$ is non-negative.

**Proof.** Suppose $\lambda$ is an eigenvalue and $\mathbf{x} \in \mathbb{R}^n$ is a nonzero eigenvector of $\lambda$. Then
$$
\mathbf{x}^T L_G \mathbf{x} = \mathbf{x}^T (\lambda \mathbf{x}) = \lambda (\mathbf{x}^T \mathbf{x}).
$$
Since $\mathbf{x}^T L_G \mathbf{x} > 0$ and $\mathbf{x}^T \mathbf{x} > 0$, we have $\lambda > 0$. $\square$

As we have noted, the Laplacian matrix $L_G$ is self-adjoint and consists of real entries. Thus the Real Spectral Theorem states that $L_G$ has an orthonormal basis consisting of eigenvectors of $L_G$. Therefore, for a graph $G$ of $n$ vertices, we can find $n$ eigenvalues (not necessarily distinct) for $L_G$. We denote them as $\lambda_1, \lambda_2, \ldots, \lambda_n$. Since they are all real and non-negative, we assume that
$$
0 < \lambda_1 \leq \lambda_2 \leq \cdots \leq \lambda_n.
$$

Now we prove some fundamental facts about Laplacians. Recall that in the previous section we mentioned that the eigenvalues of the Laplacian tell us how connected a graph is. Now, we define connectedness. First, we give the definition of a *path*
## Corollary 3.10
Let $G = (V, E)$ be a graph. Then the multiplicity of $0$ as an eigenvalue of $L_G$ equals the number of connected components of $G$.

**Proof.** Suppose $G_1 = (V_1, E_1), G_2 = (V_2, E_2), \ldots, G_k = (V_k, E_k)$ are the connected components of $G$. Let $\mathbf{w}_i$ be defined by
$$
(w_i)_{j} = 
\begin{cases} 
1 & \text{if } j \in V_i, \\ 
0 & \text{otherwise}.
\end{cases}
$$

Then, it follows from the previous lemma that if $\mathbf{x} \in \mathbb{R}^n$ is a non-zero eigenvector of $0$, then $x_i = x_j$ for any $i, j \in V$ such that $i, j$ are in the same connected component. So
$$
U_{i} = \text{Span}(\{\mathbf{w}_1, \mathbf{w}_2, \ldots, \mathbf{w}_k\}).
$$

It is clear that $\mathbf{w}_1, \mathbf{w}_2, \ldots, \mathbf{w}_k$ are linearly independent. Therefore, the multiplicity of $0$ as an eigenvalue of $L_G$ is the number of connected components in $G$. $\square$
# 4. Eigenvalues and Eigenvectors of the Laplacians of Some Fundamental Graphs

Now we begin to examine the eigenvalues and the eigenvectors of the Laplacian of some fundamental graphs.

## Definition 4.1
A complete graph on $n$ vertices, $K_n$, is a graph $G = (V, E)$ where $V = \{1, 2, \ldots, n\}$ and $E = \{(i, j) \mid i \neq j, i, j \in V\}$.

## Proposition 4.2
The Laplacian of $K_n$ has eigenvalue $0$ with multiplicity $1$ and eigenvalue $\nu$ with multiplicity $n - 1$.

**Proof.** The first part of the proposition simply follows from Corollary 3.9. To prove the second part of the proposition, consider the Laplacian of $K_n$. It is an $n \times n$ matrix defined by
$$
a_{ij} = 
\begin{cases} 
-1 & \text{if } i \neq j, \\ 
n - 1 & \text{if } i = j.
\end{cases}
$$

Therefore, $L_K - nI = M$ where $M$ is the $n \times n$ matrix with entries all equal to $-1$. Clearly, $M$ is not invertible and has rank $1$. Thus $n$ is an eigenvalue of $L_K$. Then by Rank-nullity Theorem, $\text{null}(M) = n - 1$. It follows that the eigenvalue $\nu$ has multiplicity $n - 1$. $\square$

## Definition 4.3
The path graph on $n$ vertices, $P_n$, is a graph $G = (V, E)$ where $V = \{1, 2, \ldots, n\}$ and $E = \{(i, i + 1) \mid 1 \leq i < n\}$.
