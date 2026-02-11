---
layout: post
title: "Navigating the City with Math: From Navy Waves to Traffic Waves"
date: 2026-02-09
tags: [GNN, Traffic Prediction, Spectral Graph Theory, STGMS, Research]
categories: [review, math]
description: "A deep dive into STGMS and Spectral Graph Theory, connecting naval experiences to urban traffic flow."
---

<link rel="stylesheet" type="text/css" href="https://tikzjax.com/v1/fonts.css">
<script src="https://tikzjax.com/v1/tikzjax.js"></script>

<script>
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true
  }
};
</script>

<style>
/* The ' *' selector forces ALL children elements (p, strong, math, etc.) 
   inside the box to use the dark color, overriding the theme's Dark Mode white text.
*/
.highlight-box, .highlight-box * { 
    background-color: #f0f9ff; 
    color: #0c4a6e !important; /* Force Dark Blue Text */
}
.highlight-box {
    border-left: 4px solid #0ea5e9; 
    padding: 1rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; 
}

.critical-box, .critical-box * { 
    background-color: #fff1f2; 
    color: #881337 !important; /* Force Dark Red Text */
}
.critical-box {
    border-left: 4px solid #e11d48; 
    padding: 1rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; 
}

.proposal-box, .proposal-box * { 
    background-color: #f0fdf4; 
    color: #14532d !important; /* Force Dark Green Text */
}
.proposal-box {
    border-left: 4px solid #16a34a; 
    padding: 1rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; 
}

.nuance-box, .nuance-box * { 
    background-color: #fff7ed; 
    color: #7c2d12 !important; /* Force Dark Orange Text */
}
.nuance-box {
    border-left: 4px solid #f97316; 
    padding: 1rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; 
}

.math-note, .math-note * { 
    background-color: #fafafa; 
    color: #525252 !important; /* Force Dark Gray Text */
}
.math-note {
    border: 1px solid #e5e7eb; 
    padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; font-size: 0.9em;
}

/* Ensure SVG fills in MathJax also follow the color */
.highlight-box svg path { fill: #0c4a6e !important; }
.critical-box svg path { fill: #881337 !important; }
.proposal-box svg path { fill: #14532d !important; }
.nuance-box svg path { fill: #7c2d12 !important; }
</style>

## 1. Intro: From the Sea to the Streets

I have been serving in the ROK Navy since June 2025. Sailing through the seas, my last seven months seem to have disappeared like the **wake behind the ship**, vanishing into the white foam. Now that I finally have some time to think about my future outside the military, I have found myself captivated by the problem of traffic prediction.

When planning a trip, I was never sure exactly when to leave to arrive on time. Modern technologies like Google Maps offer real-time navigation and ETAs, but some might question: *can they really give us 100% accuracy?* The ETA fluctuates constantly as road conditions change. Can we achieve higher precision in estimating these flows?

Today, I want to introduce the **Spatio-Temporal Graph Neural Network with Multi-timeScale (STGMS)**. This model predicts urban traffic flow using multi-timescale features and spatio-temporal dependencies. It utilizes the Laplacian Matrix to determine differences between adjacent nodes and employs an attention mechanism to detect global patterns on the graph $$G$$, representing our complex urban traffic network.

## 2. Core Theory: The Language of Graphs

### 1) Laplacian Matrix: Defining Smoothness

#### Definition
Let $$G = (V, E)$$be a simple undirected graph. The Laplacian matrix$$L$$ is defined as:
$$L = D - A$$
where $$D$$is the degree matrix (diagonal) and$$A$$ is the adjacency matrix. Consider a simple graph forming a "triangle" ($$K_3$$):

<link rel="stylesheet" type="text/css" href="https://tikzjax.com/v1/fonts.css">
<script src="https://tikzjax.com/v1/tikzjax.js"></script>

<div style="text-align: center; margin: 2rem 0; overflow: visible;">
  <style>
    @media (prefers-color-scheme: dark) {
      .tikz-graph svg { filter: invert(1) hue-rotate(180deg); }
    }
    /* al-folio 테마의 다크모드 클래스에 대응 (보통 body에 .dark 등이 붙음) */
    body.dark .tikz-graph svg { filter: invert(1) hue-rotate(180deg); }
  </style>

  <div class="tikz-graph">
    <script type="text/tikz">
      {% raw %}
      \begin{tikzpicture}[node distance={30mm}, thick, main/.style = {draw, circle}]
        \node[main] (1) {1};
        \node[main] (2) [right of=1] {2};
        \node[main] (3) [above right of=1, xshift=-8mm] {3};
        \draw (1) -- (2);
        \draw (2) -- (3);
        \draw (3) -- (1);
      \end{tikzpicture}
      {% endraw %}
    </script>
  </div>
  <p style="font-style: italic; color: #666; font-size: 0.9rem; margin-top: 5px;">Figure 1: A simple Triangle Graph rendered with TikZ</p>
</div>


For this graph, the Laplacian matrix is:
$$L = \begin{pmatrix}
2 & -1 & -1 \\
-1 & 2 & -1 \\
-1 & -1 & 2
\end{pmatrix}$$

#### Smoothness of the Graph Signal
The Laplacian matrix has a fundamental property related to the "smoothness" of a signal defined on the graph. Let $$\mathbf{x} \in \mathbb{R}^N$$ be a signal vector on the nodes (e.g., traffic speed at each intersection). Then, the quadratic form (Dirichlet Energy) is:
$$\mathbf{x}^T L \mathbf{x} = \sum_{(i,j) \in E} (x_i - x_j)^2$$

If this value is small, the signal $$\mathbf{x}$$ changes smoothly across the graph—meaning neighbors have similar traffic conditions.

<div style="width: 100%; margin: 2rem 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
  <iframe src="/assets/html/graph-laplacian.html" width="100%" height="700px" frameborder="0" loading="lazy" style="display: block;" title="Graph Laplacian Explorer"></iframe>
</div>
<p style="text-align: center; color: #666; font-size: 0.9em; margin-top: 0.5rem;"><em>Tip: Click an empty spot to add nodes and connect them.</em></p>

<div class="nuance-box" markdown="1">
  <strong>Mathematical Nuance: The Symmetry Requirement</strong><br><br>
  There is a subtle mathematical contradiction here. Real-world traffic is <strong>directed</strong> (e.g., one-way streets, different flows for AM/PM). However, the definition $$L = D - A$$ typically assumes an <strong>undirected</strong> graph ($$A$$ is symmetric).<br><br>
  <strong>Why?</strong> The <em>Spectral Theorem</em> guarantees that a matrix has an orthonormal basis of eigenvectors (crucial for the Graph Fourier Transform) if and only if the matrix is symmetric. If we used a directed graph's Laplacian, the eigenvalues could be complex numbers, breaking the physical interpretation of "frequencies."<br><br>
  <strong>The Compromise:</strong> Therefore, models like STGMS often symmetrize the graph ($$A_{sym} = A + A^T$$) or use distance-based Gaussian kernels to ensure mathematical stability, effectively treating the road network as a "proximity map" rather than a flow map.
</div>

### 2) The Spectral Bridge: From Fourier to Graph Convolution

To understand why STGMS uses Chebyshev polynomials, we must first look at the **Convolution Theorem**. In classical signal processing, convolution in the time domain is multiplication in the frequency domain.

For a graph signal $$\mathbf{x}$$, the Graph Fourier Transform (GFT) is defined using the eigenvectors $$U$$of the Laplacian$$L$$. The convolution of signal $$\mathbf{x}$$with a filter$$g_\theta$$ is:
$$\mathbf{x} *_G g_\theta = U g_\theta(\Lambda) U^T \mathbf{x}$$
Here, $$\Lambda$$ is the diagonal matrix of eigenvalues (frequencies).

## 3. Why ChebNet? (Solving the $$O(N^3)$$ Bottleneck)

### The Computational Hurdle
The formula above is mathematically elegant, but computationally expensive. To perform the eigendecomposition $$L = U \Lambda U^T$$, we need **$$O(N^3)$$** operations.

<div class="highlight-box" markdown="1">
  <strong>The Problem:</strong> For a city-wide traffic network with thousands of nodes ($$N$$), calculating $$U$$and$$U^T$$at every step is impossible for real-time prediction. We need a way to apply the filter$$g_\theta(\Lambda)$$without actually finding the eigenvectors$$U$$.
</div>

### The Polynomial Shortcut
This is where polynomial approximation saves the day. If we approximate the filter function $$g_\theta(\Lambda)$$as a polynomial of eigenvalues, say$$P(\Lambda) = \sum_{k=0}^K \theta_k \Lambda^k$$, a beautiful property of linear algebra emerges:
$$U P(\Lambda) U^T = P( U \Lambda U^T ) = P(L)$$

Suddenly, we don't need the eigenvectors $$U$$anymore! We only need to compute powers of the Laplacian matrix$$L^k$$. STGMS specifically uses **Chebyshev polynomials** for this approximation because they are orthogonal and numerically stable.

According to the STGMS model configuration, the recurrence relation is defined as:
$$Ch_i(L_G) = 2 L_G Ch_{i-1}(L_G) - Ch_{i-2}(L_G)$$

with initial conditions:
$$Ch_1(L_G) = L_G, \quad Ch_0(L_G) = 0$$

<div class="math-note" markdown="1">
  <strong>Professor's Observation: The $$Ch_0=0$$ Assumption</strong><br>
  In standard Approximation Theory, the 0-th order Chebyshev polynomial is typically $$T_0(x) = 1$$(Identity Matrix). However, STGMS defines it as$$0$$.<br><br>
  <strong>Why?</strong> This is likely an architectural design choice for Deep Learning. STGMS employs <strong>Residual Connections</strong> ($$y = F(x) + x$$). Since the residual connection already adds the input $$x$$(effectively$$1 \cdot x$$) to the output, including an Identity term in the convolution ($$Ch_0$$) would be redundant. Setting $$Ch_0=0$$ forces the GCN layer to learn "pure diffusion" (changes based on neighbors) while the residual path handles information preservation.
</div>

## 4. STGMS Deep Dive: The Recipe for Prediction

We have our ingredients (Laplacian Matrix) and our tool (ChebNet). Now, let’s look at the recipe. The STGMS model processes data systematically, much like a chef preparing a complex dish: prepping (decomposition), cooking (blocks), and refining.

### Step 1: Decomposition (Prepping the Data)
Traffic data might look chaotic, but it follows patterns. STGMS decomposes raw data into:
* **Weekly Period:** Traffic next Monday will likely resemble last Monday.
* **Daily Trend:** The morning rush hour happens every day.
* **Residual (Recent):** Sudden accidents or weather changes that deviate from the patterns.

### Step 2: Spatio-Temporal Block (Mixing Space and Time)
This is the engine of the model. It combines three powerful mechanisms:

#### 1. Temporal Attention (Time)
"Does yesterday's congestion matter right now?" Temporal attention assigns weights to different past time steps.

#### 2. Spatial Attention (Global Context)
"Why does a jam in the city center affect the outskirts?" Spatial attention looks for semantic relationships across the graph.

#### 3. Chebyshev GCN (Local Diffusion)
This handles the physical propagation of traffic. By using the polynomial approximation ($$L^k$$), it aggregates information from $$K$$-hop neighbors efficiently without expensive matrix inversions.

<div class="critical-box" markdown="1">
  <strong>The "Over-smoothing" Problem</strong><br><br>
  Mathematically, as $$K$$increases (multiplying$$L$$ many times), the node features in a GNN tend to converge to a stationary distribution. This is known as <strong>Over-smoothing</strong>.<br><br>
  If $$K$$is too large, the unique signal of each intersection is washed out, and every node starts looking the same. This is why models typically limit$$K$$(e.g.,$$K=3$$)—it captures the local neighborhood without destroying the distinct identity of the nodes.
</div>

## 5. Future Work: From Flow to Intention

Up to this point, we have analyzed how STGMS cooks the data using fluid dynamics analogies ($$x^T L x$$). But as I stand on the deck of my ship, a fundamental question strikes me:

*"Is it really okay to treat cars like water molecules?"*

### Current Limitations: Cars Are Not Raindrops
Most GNN-based traffic models assume that traffic flow is governed by physical proximity (topology). However, traffic jams often arise from the **clashing of intentions**—what I call "OD (Origin-Destination) based Turbulence." Even if two roads are connected ($$A_{ij}=1$$), flow might stop if drivers are trying to merge aggressively to reach a destination.

### Proposal: From Topological to Intentional Graphs
Therefore, I propose a new direction: learning the **Latent Destination Distribution** to dynamically alter the graph structure.

<div class="proposal-box" markdown="1">
  <h4>Proposal: Dynamic Intention Graph Learning</h4>
  <p>Instead of a static adjacency matrix $$A$$, we introduce a time-varying <strong>Intention Graph $$A^{(t)}_{intent}$$</strong>:</p>
  $$A^{(t)}_{final} = A_{topo} + \alpha \cdot A^{(t)}_{intent}$$
  <p>Here, $$A^{(t)}_{intent}$$ connects nodes based on current travel demands (OD patterns), not just physical proximity.</p>
</div>

<div class="nuance-box" markdown="1">
  <strong>Professor's Note: A Mathematical Challenge</strong><br><br>
  <strong>The Spectral Dilemma:</strong> Introducing a dynamic $$A^{(t)}_{intent}$$ poses a fascinating mathematical challenge.<br><br>
  If $$A^{(t)}_{intent}$$represents "intention to move from A to B," it is inherently <strong>asymmetric</strong>. As we discussed in Section 2, the Laplacian of an asymmetric matrix may yield <strong>complex eigenvalues</strong>. This breaks the foundation of the Chebyshev approximation, which relies on eigenvalues being real and bounded within$$[-1, 1]$$.<br><br>
  <strong>The Solution?</strong> To implement this "Intention Graph," we would likely need to abandon Spectral GCNs (ChebNet) and adopt <strong>Spatial GNNs</strong> (like Graph Attention Networks or Message Passing Neural Networks). Spatial methods operate directly on the graph structure without relying on the eigendecomposition of the Laplacian, making them robust to the asymmetry of human intention.
</div>

Just as I learned to read the currents of the sea, I hope to one day read the currents of human intention flowing through the city. That is the research I aspire to pursue after my service concludes.
