---
title: "最小角回帰 ( LARS ) の理論と実装"
pubDate: 2023-03-13
description: "LARSアルゴリズムの修正はLASSO推定量を求める方法の一つである。LARSの理論と実装、LASSO推定量への修正方法を理解する。"
tags: ["統計学", "Julia"]
prev: ""
next: ""
---
# 最小角回帰 ( LARS ) の理論と実装
LASSO推定量を求める方法の一つに、最小角回帰 ( Least Angle Regression, LARS ) のアルゴリズムを修正するというものがある。LARSは線形モデルの変数選択の手法として知られており、残差 $\bm{y-\hat\mu}$ となす角が最小となる（すなわち相関が高い）変数 $\bm{x}_j$ を順番にモデルに取り入れていくアルゴリズムから最小角回帰と呼ばれる。
はじめに、LARSの推定量を求めるアルゴリズムを理解する。次にJuliaでアルゴリズムを実装する。

## LARSの理論

### 問題設定
次のような線形モデルを考える。ここで、 $p\times n$ 行列 $X$ は $n$ 次元の説明変数ベクトル $\bm{x}_j,\,j=1,\cdots,p$ からなる。また、 $\bm\beta$ は $p$ 次元の回帰係数ベクトル、$\bm y$ は $n$ 次元の目的変数ベクトルで、 $\bm\varepsilon$  は平均 $0$ で分散が一定の誤差項である。

$$
\bm{y} = X\bm\beta + \bm\varepsilon
$$

ここで $\bm\beta$ のうち、幾つかの $\beta_j$ は真に $0$ であると仮定する。つまり、目的変数に関して、全く寄与しないような説明変数が存在する。そのような説明変数については、正しく $0$ と推定したい。

また、これらの変数には以下の基準化がされている。
$$
\begin{align*}
&\sum_{i=1}^nx_{ij} = 0, & \sum_{i=1}^nx_{ij}^2 = n \\[5px]
&\sum_{i=1}^ny_{i} = 0
\end{align*}
$$

### LARS推定量の導出
始めに、$\bm\beta$の推定量 $\hat{\bm\beta}$ のうち、非ゼロな $\hat\beta_j$ の添え字 $j$ は集合 $\mathcal A$  ( active set ) に属するとする。

$$
\mathcal A = \{ j \in \{1,\cdots,p\}| \hat\beta_j \not= 0 \}
$$

LARSアルゴリズムは $p$ ステップの推定量の更新で構成される。初期値を $\hat{\bm\beta} = \bm0$ として、  $1$ ステップ目では、残差 $\bm{y-\hat\mu}$ との内積の絶対値が最大となる（つまり相関が高い）ような説明変数 $\bm{x}_j$ の添え字 $j$ を $\mathcal A$ に加える。ここで、 $\bm{\hat\mu} = X\bm{\hat\beta}$ である。つまり、以下の式を満たすような $j$ で active set を更新する。

$$
j = \arg\max_j |\bm{x}_j^\intercal(\bm{y-\hat\mu})|
$$

これは、残差 $\bm{y-\hat\mu}$ と成す角が小さい説明変数 $\bm{x}_j$ の添え字 $j$ で $\mathcal A$ を更新するとも解釈できる。

次に、$\bm{\hat\mu}$ を $\bm{x}_j$ で更新することを考える。わかりやすくするために、 $k$ ステップ目の推定量を $\bm{\hat\mu}_k$ とすると、 $\bm{\hat\mu}_1$ は以下のように更新される。

$$
\begin{align*}
\mathrm{sign}(x) &= \begin{cases}1&&x>0\\0&&x=0\\-1&&x<0\end{cases}\\[10px]
\bm{\hat\mu}_1 &= \bm0 + \gamma\mathrm{sign}(\bm{x}_j^\intercal(\bm{y-0}))\bm{x}_j
\end{align*}
$$

ここで、 $\gamma$ は正の実数である。 $\gamma$ はどのようにして決まるのだろうか。 $\gamma$ を $0$ から少しずつ大きくしていくことを考える。この時、$\bm{y}$ は $\bm{x}_j$ によって説明されるわけだから、$\bm{x}_j$ と 残差 $\bm{y-\hat\mu_1}$ との相関は低くなる。$\gamma$ を大きくしていく（相関を低くする）途中で、$\bm{y-\hat\mu_1}$ との相関が同程度の $\bm{x}_l, l\in\mathcal A^c$ が現れる。この $\bm{x}_l$ は $\bm y$ に対して、$\bm{x}_j$ と同程度寄与すると考えられるから、$l$ も active set に加えるべきだろう。このような $l$ が現れる最小な $\gamma$ が $\bm\mu_1$ の更新に用いられる。また、$l$ は $2$ ステップ目の始めに $\mathcal A$ に加える。

$2$ ステップ以降は $\gamma$ の導出がやや複雑になる。全ての $\bm{x}_j, j \in \mathcal A$ について、残差との内積の絶対値を一定に保ちながら、$\bm{\hat\mu}$ を更新する必要があるからだ。 $k$ ステップ目において、このことは以下のように表せる。

$$
\begin{align*}
&X_{\mathcal A} = \begin{bmatrix} & \cdots & \mathrm{sign}(\bm{x}_j^\intercal(\bm{y}-\bm{\hat\mu}_{k-1}))\bm{x}_j & \cdots & \end{bmatrix}, \quad j \in \mathcal A \\[5px]
&X_{\mathcal A}^\intercal (\bm{y}-\bm{\hat\mu}_{k-1})= \mathrm {constant} \times \bm1
\end{align*}
$$

ここで、以下を満たすような単位ベクトル $\bm u$ で $\bm{\hat\mu}_{k-1}$ を更新することを考える。
$u$ は線形代数の基本的な性質から求められる。
$$
\begin{align*}
&X_{\mathcal A}^\intercal \bm u= A \times \bm1 \\[5px]
& U = X_{\mathcal A}(X_{\mathcal A}^\intercal X_{\mathcal A})^{-1}\bm1 \\[5px]
& \bm u= AU, \quad A=\|U\|^{-1}=(\bm1^\intercal(X_{\mathcal A}^\intercal X_{\mathcal A})^{-1}\bm1)^{-\frac12}
\end{align*}
$$

以上の $\bm u$ を用いて、$\bm{\hat\mu}_{k} = \bm{\hat\mu}_{k-1} + \gamma \bm u$ のように更新される。また、 $k+1$ ステップで新たに $\mathcal A$ に追加される $l \in \mathcal A^c$ について、以下が成り立つ。

$$
\begin{align*}
&X_{\{\mathcal A,l\}}= \begin{bmatrix} & \cdots & \mathrm{sign}(\bm{x}_j^\intercal(\bm{y}-\bm{\hat\mu}_{k}))\bm{x}_j & \cdots & \end{bmatrix}, \quad j \in \{\mathcal A,l\} \\[5px]
&X_{\{\mathcal A,l\}}^\intercal (\bm{y}-\bm{\hat\mu}_{k})= \mathrm {constant} \times \bm1
\end{align*}
$$

このような条件を満たす最小の $\gamma$ を求めたい。まず、 $C = \max|\bm{x}_j^\intercal(\bm{y}-\bm{\hat\mu}_{k-1})|, \, j\in \mathcal A$ とおく。ただし、$\max|\bm{x}_j^\intercal(\bm{y}-\bm{\hat\mu}_{k-1})| = |\bm{x}_j^\intercal(\bm{y}-\bm{\hat\mu}_{k-1})|, \, j\in \mathcal A$ が常に成り立つ。ここで、 $j\in \mathcal A$ について、以下が成り立つ。
$$
\begin{align*}
 |\bm{x}_j^\intercal(\bm{y}-\bm{\hat\mu}_{k})| &=  
 |\bm{x}_j^\intercal(\bm{y}-\bm{\hat\mu}_{k-1}-\gamma\bm{u})| \\[5px]
 &= 
 |\bm{x}_j^\intercal(\bm{y}-\bm{\hat\mu}_{k-1})|-\gamma\mathrm{sign}(\bm{x}_j^\intercal(\bm{y}-\bm{\hat\mu}_{k-1}))\bm{x}_j^\intercal\bm{u} \\[5px]
  &= 
 C-\gamma A
\end{align*}
$$

次に、$k+1$ ステップで新たに $\mathcal A$ に追加される $l \in \mathcal A^c$ について、以下が成り立つ。

$$
\begin{align*}
 |\bm{x}_l^\intercal(\bm{y}-\bm{\hat\mu}_{k})| &=  
 |\bm{x}_l^\intercal(\bm{y}-\bm{\hat\mu}_{k-1}-\gamma\bm{u})| \\[5px]
 &= 
 |\bm{x}_l^\intercal(\bm{y}-\bm{\hat\mu}_{k-1})|-\gamma\mathrm{sign}(\bm{x}_l^\intercal(\bm{y}-\bm{\hat\mu}_{k-1}))\bm{x}_l^\intercal\bm{u} \\[5px]
\end{align*}
$$

ここで、 $c=\bm{x}_l^\intercal(\bm{y}-\bm{\hat\mu}_{k-1}),\, a=\bm{x}_l^\intercal\bm{u}$ とすると、以下が成り立つ。

$$
\begin{align*}
 |\bm{x}_l^\intercal(\bm{y}-\bm{\hat\mu}_{k})| &=  
 \begin{cases}
 c-\gamma a & c \geq 0 \\[5px]
 -c+\gamma a & c < 0
 \end{cases}
\end{align*}
$$

以上より、 $k$ ステップ目の $\gamma$ は、 $|\bm{x}_j^\intercal(\bm{y}-\bm{\hat\mu}_{k})| = |\bm{x}_l^\intercal(\bm{y}-\bm{\hat\mu}_{k})|$ の方程式を解くことで、以下のように求められる。

$$
\gamma = \min_{l\in\mathcal A^c}{}^+
\Big\{
\frac{C-c}{A-a}, \, \frac{C+c}{A+a}
\Big\}
$$

次に、$k$ ステップ目の回帰係数 $\hat\beta_j$ の更新について考える。 $\bm{\hat\mu}_{k} = \bm{\hat\mu}_{k-1} + \gamma \bm u$ から、 $k$ ステップ目の回帰係数ベクトルを $\bm{\hat\beta}_k$ とすると以下が成り立つ。

$$
\begin{align*}
\bm{\hat\mu}_{k} &= \bm{\hat\mu}_{k-1} + \gamma \bm u \\[5px]
X\bm{\hat\beta}_k &= X\bm{\hat\beta}_{k-1} + \gamma AX_{\mathcal A}(X_{\mathcal A}^\intercal X_{\mathcal A})^{-1}\bm1 \\[5px]
\begin{bmatrix} & \cdots & \bm{x}_j & \cdots & \end{bmatrix}\bm{\hat\beta}_k 
&= \begin{bmatrix} & \cdots & \bm{x}_j & \cdots & \end{bmatrix}\bm{\hat\beta}_{k-1} + \begin{bmatrix} & \cdots & \mathrm{sign}(\bm{x}_j^\intercal(\bm{y}-\bm{\hat\mu}_{k-1}))\bm{x}_j & \cdots & \end{bmatrix}\gamma A(X_{\mathcal A}^\intercal X_{\mathcal A})^{-1}\bm1 \\[5px]

\hat\beta_{j,k} &= \hat\beta_{j,k-1} + \gamma A\mathrm{sign}(\bm{x}_j^\intercal(\bm{y}-\bm{\hat\mu}_{k-1}))\Big((X_{\mathcal A}^\intercal X_{\mathcal A})^{-1}\bm1\Big)_j \\[5px]

\end{align*}
$$

### LARSアルゴリズム
1. $\bm{\hat\mu}=\bm0,\,\mathcal A = \phi$ に初期化する。
2. $j = \arg\max_j |\bm{x}_j^\intercal(\bm{y-\hat\mu})|$ を $\mathcal A$ に加える。
3. $\gamma = \min_{l\in\mathcal A^c}{}^+
\Big\{
\frac{C-c}{A-a}, \, \frac{C+c}{A+a}
\Big\}$ によって、$\bm{\hat\mu}_{k} = \bm{\hat\mu}_{k-1} + \gamma \bm u$ を更新する。
4. $l$ を $\mathcal A$ に加える。

## LARSアルゴリズムの実装
JuliaでLARSアルゴリズムを実装した。

```julia
function LARS(X,y)
    n, p = size(X)

    active = []
    inactive = collect(1:p)
    β = zeros(p)
    β_ = zeros(p)
    μ = zeros(n)
    
    j = argmax(abs.(X' * (y - μ)))
    
    for k in 1:p
        
        deleteat!(inactive, findall(x->x==j,inactive))
        append!(active, j)
        
        c = X' * (y - μ)
        
        s = sign.(c[active])
        Xₐ = X[:,active] .* repeat(s,1,n)'
        C = maximum(abs.(c[active]))
        g = (Xₐ' * Xₐ)^(-1)

        A = 1/sqrt(sum(g))
        u = A * sum(Xₐ * g, dims=2)
        
        
        if k == p
            γ = C / A
        else
            Xᵢ = X[:,inactive]
            a = Xᵢ' * u
            
            γ₁ = (-c[inactive] .+ C) ./ (-a .+ A)
            γ₂ = (c[inactive] .+ C) ./ (a .+ A)
            Γ = [ γ₁ γ₂ ]
            γ = minimum(Γ[Γ.>0])
            j = inactive[findfirst(x->x.==γ,Γ)[1]]
        end
        
        μ += γ * u
        for j_ in 1:length(active)
            β[active[j_]] += γ * A * s[j_] * sum(g,dims=2)[j_]
        end
        append!(β_, β)
    end
    return (β = β,
            μ = μ,
            β_ = reshape(β_,p,p+1))
end
```

## LASSO修正

### LASSO推定量
LARSアルゴリズムで、LASSO推定量を求めるためには、一部のアルゴリズムを修正しなければならない。非 $0$ な $\hat\beta_j$ がステップを重ねる仮定で、 $0$ を通過する（ $k-1$ ステップと $k$ ステップで $\hat\beta_j$ の符号が逆転する）場合、そのような $j$ を active set から取り除く必要がある。このような $\hat\beta_j$ が現れる条件は以下で与えられる。

$$
\begin{align*}
\hat\beta_{j,k} &= \hat\beta_{j,k-1} + \gamma A\mathrm{sign}(\bm{x}_j^\intercal(\bm{y}-\bm{\hat\mu}_{k-1}))\Big((X_{\mathcal A}^\intercal X_{\mathcal A})^{-1}\bm1\Big)_j  \\[5px]
&= \hat\beta_{j,k-1} + \gamma d_j \\[5px]

\overset\sim\gamma_j&= -\frac{\hat\beta_{j,k-1}}{d_j}
\end{align*}
$$

$$
\gamma > \min{}^{+}(\overset\sim\gamma_j)
$$

このような $\overset\sim\gamma_j$ が存在する場合、推定値の更新には、 $\gamma$ ではなく、 $\overset\sim\gamma_j$ を用いる。また、$\mathcal A$ から $j$ を取り除く。

修正したJuliaのコードは次のようになる。

```julia
function LARSSO(X,y)
    n, p = size(X)

    active = []
    inactive = collect(1:p)
    β = zeros(p)
    β_ = zeros(p)
    μ = zeros(n)
    
    j = argmax(abs.(X' * (y - μ)))
    
    flag = false
    while length(inactive) != 0
        
        if !flag
            deleteat!(inactive, findall(x->x==j,inactive))
            append!(active, j)
        end
        c = X' * (y - μ)
        
        s = sign.(c[active])
        Xₐ = X[:,active] .* repeat(s,1,n)'
        C = maximum(abs.(c[active]))
        g = (Xₐ' * Xₐ)^(-1)

        A = 1/sqrt(sum(g))
        u = A * sum(Xₐ * g, dims=2)
        
        
        if length(inactive) == 0
            γ = C / A
        else
            Xᵢ = X[:,inactive]
            a = Xᵢ' * u
            
            γ₁ = (-c[inactive] .+ C) ./ (-a .+ A)
            γ₂ = (c[inactive] .+ C) ./ (a .+ A)
            Γ = [ γ₁ γ₂ ]
            γ = minimum(Γ[Γ.>0])
            j = inactive[findfirst(x->x.==γ,Γ)[1]]
        end
        
        
        d = A * s .* sum(g,dims=2)

        γ_ = -β[active] ./ d
        
        flag = false
        if γ > minimum([ γ_[γ_ .> 0]; γ ])
            γ = minimum(γ_[γ_ .> 0])
            j = findfirst(x->x.==γ,γ_)
            flag = true
        end
        
        μ += γ * u
        
        for j_ in 1:length(active)
            β[active[j_]] += γ * d[j_]
        end
        append!(β_, β)
        
        if flag
            append!(inactive, active[j])
            deleteat!(active, findall(x->x==active[j],active))
        end
    end
    
    return (β = β,
            μ = μ,
            β_ = reshape(β_,p,Int(length(β_)/p)))
end
```

### 結果の比較
`boston housing` のデータセットを用いてそれぞれの推定量の推移を可視化した。なお、説明変数は標準化、目的変数は中心化されている。

```julia
using PyCall
datasets = pyimport("sklearn.datasets")

boston_housing = datasets.load_boston()
X = boston_housing["data"]
y = boston_housing["target"]

n, p = size(X)

meanX = repeat(sum(X, dims=1) ./ n, n, 1)
varX = repeat(sum((X - meanX).^2, dims=1) ./ n, n, 1)

X_normalized = (X - meanX) ./ sqrt.(varX)
meany = sum(y) / n
y_centerlized = y .- meany

LARS_β = LARS(X_normalized, y_centerlized).β_
LASSO_β = LARSSO(X_normalized, y_centerlized).β_
```

```julia
using PyPlot

fig = figure(figsize = (12,6))
ax = fig.add_subplot(1,2,1)
ax.set_title("LARS")
for j in 1:13
    ax.plot(LARS_β[j,:])
end

ax = fig.add_subplot(1,2,2)
ax.set_title("LASSO")
for j in 1:13
    ax.plot(LASSO_β[j,:])
end
```

![LARS, LASSO](/posts/lars/lars.png)



> **参考文献**
> [LEAST ANGLE REGRESSION, B Efron et al.](https://arxiv.org/pdf/math/0406456.pdf)
> The Elements of Statistical Learning, T Hastie et al.
> スパース推定法による統計モデリング 統計学One Point, 川野秀一
> [LARS(Least Angle Regression)アルゴリズムの理論と実装](https://satopirka.com/2021/01/lars-lasso/)
> [LARS(Least Angle Regression)アルゴリズムまとめ(Python, sklearn)](https://leck-tech.com/machine-learning/lars)
