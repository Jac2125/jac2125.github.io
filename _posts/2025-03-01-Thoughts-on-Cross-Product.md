---
layout: post
title: Thoughts on the Cross Product
date: 2025-03-01
description: Unpacking the geometric intuition behind the cross product formula.
tags: math LinearAlgebra
categories: math
related_posts: false
---

Ever since I was in high school learning about vectors and their operations, I always wondered about the justification behind the cross product. Teachers hand us this magical formula and tell us two things: the resulting vector is perfectly perpendicular to the two input vectors, and its length is exactly equal to the area of the parallelogram formed by them. 

But *why*? Why does a seemingly random combination of multiplications and subtractions perfectly spit out an orthogonal vector with such a specific length? Let's dive into the geometric intuition behind it.

### 1. The Definition of the Cross Product

Let's quickly review what we are dealing with. If we have two vectors in 3D space, $\mathbf{a} = \langle a_1, a_2, a_3 \rangle$ and $\mathbf{b} = \langle b_1, b_2, b_3 \rangle$, their cross product is traditionally defined using the determinant of a formal $3 \times 3$ matrix:

$$
\mathbf{a} \times \mathbf{b} = 
\begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
a_1 & a_2 & a_3 \\
b_1 & b_2 & b_3 \\
\end{vmatrix}
$$

Expanding this determinant along the top row gives us the familiar formula:

$$
\mathbf{a} \times \mathbf{b} = 
(a_2 b_3 - a_3 b_2)\mathbf{i} - 
(a_1 b_3 - a_3 b_1)\mathbf{j} + 
(a_1 b_2 - a_2 b_1)\mathbf{k}
$$

Or, in coordinate form:

$$
\mathbf{a} \times \mathbf{b} = \langle a_2 b_3 - a_3 b_2,\ a_3 b_1 - a_1 b_3,\ a_1 b_2 - a_2 b_1 \rangle
$$

<div class="row justify-content-sm-center">
    <div class="col-sm">
        {% include figure.liquid path="assets/img/Cross_product.png" title="Cross Product" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

We know the algebra, but the geometry is what's really beautiful here. To understand the output of the cross product, we first need to take a slight detour and talk about what a determinant actually represents geometrically.

### 2. The Link: $\det(A)$ = Area

Before we tackle 3D space, let's step down to a 2D plane. Let $A$ be a $2 \times 2$ matrix formed by two column vectors. A beautiful fact in linear algebra is that the absolute value of the determinant of $A$ is exactly equal to the area of the parallelogram spanned by its column vectors.

Why is this true? Imagine a diagonal matrix:

$$
D = \begin{bmatrix} a & 0 \\ 0 & d \end{bmatrix}
$$

The vectors are $\langle a, 0 \rangle$ and $\langle 0, d \rangle$. They form a simple rectangle with width $a$ and height $d$. The area is obviously $ad$. Notice that the determinant $\det(D) = ad - 0 = ad$. The math checks out!

Now, what if the matrix isn't diagonal? We can use Elementary Column Operations (specifically, adding a multiple of one column to another). Geometrically, this operation is a **shear**. Think of a deck of cards: if you push the side of the deck so it slants, the shape changes into a parallelogram, but the volume (or area, in 2D) stays exactly the same. Cavalieri's principle guarantees this. 

Crucially, in linear algebra, adding a multiple of one column to another *does not change the determinant*. Therefore, any parallelogram can be sheared back into a rectangle without changing its area or its determinant. This proves that the determinant fundamentally measures the scaling factor of area! *(For a fantastic visual breakdown of this, I highly recommend checking out the [Interactive Linear Algebra textbook from Georgia Tech](https://textbooks.math.gatech.edu/ila/determinants-volumes.html).)*

### 3. Bringing It Back to 3D: Rotations and the Cross Product

Now, let's tie this back to our $3 \times 3$ cross product. We want to prove that $\mathbf{a} \times \mathbf{b}$ gives an orthogonal vector whose length is the area of the parallelogram spanned by $\mathbf{a}$ and $\mathbf{b}$.

Suppose $\mathbf{a}$ and $\mathbf{b}$ are linearly independent vectors in $\mathbb{R}^3$. Together, they span a 2D plane sitting somewhere in that 3D space. 

Here is the clever trick: we can apply a **rotation matrix** $R$ to the entire space. We choose $R$ specifically so that the plane containing $\mathbf{a}$ and $\mathbf{b}$ rotates to lie perfectly flat on the standard $xy$-plane. 

Rotations are rigid transformations. They preserve lengths, angles, and volumes. Mathematically, a rotation matrix $R$ has a determinant of $+1$. 

After rotating, our new vectors look like this:
- $R\mathbf{a} = \langle x_1, y_1, 0 \rangle$
- $R\mathbf{b} = \langle x_2, y_2, 0 \rangle$

Because the $z$-components are now zero, let's compute the cross product of these rotated vectors using our determinant definition:

$$
(R\mathbf{a}) \times (R\mathbf{b}) = 
\begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
x_1 & y_1 & 0 \\
x_2 & y_2 & 0 \\
\end{vmatrix}
$$

If we expand this, the $\mathbf{i}$ and $\mathbf{j}$ components vanish completely! We are left with exactly one non-zero component:

$$
(R\mathbf{a}) \times (R\mathbf{b}) = (x_1 y_2 - x_2 y_1)\mathbf{k}
$$

Look closely at that coefficient: $x_1 y_2 - x_2 y_1$. That is exactly the $2 \times 2$ determinant of the vectors in the $xy$-plane! And as we proved in the previous section, this value is exactly the **Area** of the parallelogram.

So, the result of our rotated cross product is:
$$\text{Area} \cdot \mathbf{k}$$

This vector points straight up along the $z$-axis (which is perfectly perpendicular to the $xy$-plane where our vectors live), and its length is exactly the area of the parallelogram. 

### Conclusion

Because our initial rotation $R$ preserved all lengths and angles, rotating the whole system *back* to its original orientation in 3D space means our resulting vector also rotates. It remains perfectly perpendicular to the plane containing $\mathbf{a}$ and $\mathbf{b}$, and its length remains the area of the parallelogram. 

The cross product isn't just an arbitrary trick to torture high schoolers. It is a highly compressed, elegant algebraic tool that captures the geometric reality of areas and orthogonality in 3-dimensional space. Once you view it through the lens of determinants and rotations, the "magic" formula becomes a perfectly logical conclusion.