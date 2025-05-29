#include <vector>
#include <algorithm>
#include <numeric>
#include <cmath>
#include <limits>
#include <chrono>
#include <emscripten/emscripten.h>
using namespace std;
using namespace std::chrono;

const int INF = numeric_limits<int>::max() / 2;

// ── 원본 C++ 알고리즘 ────────────────────────────────────────────
void exactKnapsack2D(
    const vector<int>& wt,
    const vector<int>& val,
    int W,
    int& result,
    vector<int>& sel
) {
    int n = wt.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; ++i) {
        for (int w = 0; w <= W; ++w) {
            dp[i][w] = dp[i - 1][w];
            if (w >= wt[i - 1])
                dp[i][w] = max(dp[i][w],
                               dp[i - 1][w - wt[i - 1]] + val[i - 1]);
        }
    }
    int w = W;
    for (int i = n; i >= 1; --i) {
        if (dp[i][w] != dp[i - 1][w]) {
            sel.push_back(i - 1);
            w -= wt[i - 1];
        }
    }
    reverse(sel.begin(), sel.end());
    result = dp[n][W];
}

void approxKnapsackFPTAS(
    const vector<int>& wt,
    const vector<int>& val,
    int W,
    double epsilon,
    int& result,
    vector<int>& sel
) {
    int n = wt.size();
    int vmax = *max_element(val.begin(), val.end());
    double K = (epsilon * vmax) / n;
    if (K <= 0) { result = 0; return; }

    vector<int> sval(n);
    for (int i = 0; i < n; ++i)
        sval[i] = static_cast<int>(floor(val[i] / K));
    int S = accumulate(sval.begin(), sval.end(), 0);

    vector<int> dp(S + 1, INF), parentVal(S + 1, -1), parentItem(S + 1, -1);
    dp[0] = 0;
    for (int i = 0; i < n; ++i) {
        for (int v = S; v >= sval[i]; --v) {
            int newW = dp[v - sval[i]] + wt[i];
            if (newW < dp[v] && newW <= W) {
                dp[v] = newW;
                parentVal[v] = v - sval[i];
                parentItem[v] = i;
            }
        }
    }

    int bestV = 0;
    for (int v = 0; v <= S; ++v)
        if (dp[v] <= W) bestV = v;

    int v = bestV;
    while (v > 0 && parentItem[v] != -1) {
        sel.push_back(parentItem[v]);
        v = parentVal[v];
    }
    reverse(sel.begin(), sel.end());

    result = 0;
    for (int idx : sel)
        result += val[idx];
}

// ── C-호환 래퍼 + 시간 측정 ─────────────────────────────────────
extern "C" {

EMSCRIPTEN_KEEPALIVE
void exactKnapsack2D_c(
    const int* wt,
    const int* val,
    int n,
    int W,
    int* result,
    int* sel,
    int* time_us
) {
    auto t1 = high_resolution_clock::now();

    vector<int> vwt(wt, wt + n);
    vector<int> vval(val, val + n);
    vector<int> vsel;
    int out;
    exactKnapsack2D(vwt, vval, W, out, vsel);

    auto t2 = high_resolution_clock::now();
    *time_us = (int)duration_cast<microseconds>(t2 - t1).count();
    *result  = out;
    for (int i = 0; i < (int)vsel.size(); ++i)
        sel[i] = vsel[i];
}

EMSCRIPTEN_KEEPALIVE
void approxKnapsackFPTAS_c(
    const int* wt,
    const int* val,
    int n,
    int W,
    double epsilon,
    int* result,
    int* sel,
    int* time_us
) {
    auto t1 = high_resolution_clock::now();

    vector<int> vwt(wt, wt + n);
    vector<int> vval(val, val + n);
    vector<int> vsel;
    int out;
    approxKnapsackFPTAS(vwt, vval, W, epsilon, out, vsel);

    auto t2 = high_resolution_clock::now();
    *time_us = (int)duration_cast<microseconds>(t2 - t1).count();
    *result  = out;
    for (int i = 0; i < (int)vsel.size(); ++i)
        sel[i] = vsel[i];
}

} // extern "C"
