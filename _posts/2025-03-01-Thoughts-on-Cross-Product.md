---
layout: post
title: ThoughtsOnCrossProduct
date: 2025-03-01
description: 
tags: math LinearAlgebra
categories: math
related_posts: false
---

This is a mini-post about my thought about the cross product. The definition is the following:

Let \(\mathbf{a} = \langle a_1, a_2, a_3 \rangle\) and \(\mathbf{b} = \langle b_1, b_2, b_3 \rangle\).  
The cross product is defined as:

$$
\mathbf{a} \times \mathbf{b} = 
\begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
a_1 & a_2 & a_3 \\
b_1 & b_2 & b_3 \\
\end{vmatrix}
$$

Expanding this determinant:

$$
\mathbf{a} \times \mathbf{b} = 
(a_2 b_3 - a_3 b_2)\mathbf{i} - 
(a_1 b_3 - a_3 b_1)\mathbf{j} + 
(a_1 b_2 - a_2 b_1)\mathbf{k}
$$

Or, in vector form:

$$
\mathbf{a} \times \mathbf{b} = \langle a_2 b_3 - a_3 b_2,\ a_3 b_1 - a_1 b_3,\ a_1 b_2 - a_2 b_1 \rangle
$$

They said, the length of vector given by the cross product of two vector is equivalent to the area of parellogram made by those two vectors.

<div class = "row justify-content-sm-center">
    <div class = "col-sm">
        {% include figure.liquid path = "assets/img/Cross_product.png" title = "Cross Product" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

But why the length is really equal to the area of the parellogram? I was wondering this from my highschool.
For someone who's studying cross product and wondering why they are equal to each other, this will help.

To begin with, you must know the **determinant** of the matrix.

Let's see this example:
$$
\begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
3 & 4 & 0 \\
1 & 2 & 0 \\
\end{vmatrix}
$$

Those two vectors are in 2-Dimensional plane as they do not have the third element.
The definition of the cross product would give:
$$
(0)\mathbf{i} - 
(0)\mathbf{j} + 
(2*3-1*4)\mathbf{k}
= \begin{vmatrix}
3 & 4 \\
1 & 2 \\
\end{vmatrix} \mathbf{k}
$$

Then we need to show why the determinant is equal to the volume.
First we need to assume that the rows are linearly independent, unless the determinant would be zero.
Adding the multiple of a column to another does not change the determinant. So, by doing some ERO (Eelementary Row Operation), you would end up a diagonal matrix whose determinant is the same as the original matrix. Think each diagonal entry as a side length of rectangle (e.g. in 2D plane). So the determinant is really the volume made by columns of matrix.

Back to where we started, after getting a area, we multiplied this area to $$\mathbf{k}$$