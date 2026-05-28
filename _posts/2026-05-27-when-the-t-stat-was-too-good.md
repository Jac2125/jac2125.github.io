---
layout: post
title: When the t-stat Was Too Good to Be True
date: 2026-05-27
description: Rebuilding a broken PEAD test from the ground up — why a cumulative sum breaks a t-test, what the real unit of analysis is, and how a diagnostic journey ended in an honest "no signal here (yet)."
tags: quant statistics PEAD hypothesis-testing
categories: quant
---

I bought some stock right before leaving for the military. It dropped while I was away, and there is a particular kind of helplessness in watching a number fall when you cannot touch it. To redirect that ache I started studying optimization — and somewhere in there I realized optimization is not just a math exercise, it reaches into markets too. That realization pulled me into quant, and the first thing that caught my eye was a phenomenon called **PEAD**: Post-Earnings-Announcement Drift. The claim is simple and almost too tidy — after a company beats earnings expectations, its price keeps drifting upward for weeks, as if the market digests good news slowly. If that drift is real and measurable, it is an optimization problem in disguise: *which combination of variables best explains the abnormal return?*

So I wrote code to validate it. My first hypothesis was deliberately naive — the plainest possible version of the claim: **if the EPS surprise is positive, then the cumulative abnormal return over the next 30 days (t+1 to t+30) will be greater than zero.** That sentence is testable, which is its virtue; it is also hiding two traps that took the rest of this journey to surface. (The full original script is in the appendix.)

And the first time I ran the significance test, I got t-statistics like $$ \pm 12 $$ and $$ \pm 23 $$. I should have been thrilled. Instead something felt wrong. A t-stat that large is not a discovery; it is a smell. For a while I half-believed the numbers — surely my data really was that strong — because I trusted that if I just computed the standard deviation correctly, the test would handle the rest on its own. That trust was the actual mistake, and finding the exact place it broke is the real starting point of this post. What follows is chasing that smell down to its source, rebuilding the test correctly, and then — honestly — finding no signal at all, and why that "failure" is the most useful result I have gotten so far.

## Why the original test was broken

My original code did something that looks reasonable until you stare at it. For each earnings event, it computed a 30-day path of cumulative abnormal returns (CAR), then ran a one-sample t-test on that path:

```python
ar = event_window['Stock'] - expected_return   # 30 daily abnormal returns
car = ar.cumsum()                               # 30 cumulative values
t_stat, p_value = ttest_1samp(car, 0)           # the bug lives here
```

The problem is what `ttest_1samp` *assumes* about its input. The t-statistic is

$$ t = \frac{\bar{x} - \mu_0}{s / \sqrt{n}} $$

and the entire formula rests on one quiet assumption hiding in the denominator: that $$ s / \sqrt{n} $$ correctly measures how much the sample mean wobbles. That only holds if the observations are **independent**. A CAR path violates this as badly as a series possibly can, because $$ \text{CAR}_t = \text{CAR}_{t-1} + r_t $$ — each value is the previous value plus one small increment. Thirty consecutive points share twenty-nine of their thirty summands. They are not "somewhat correlated"; they are almost perfectly correlated.

> **The Hidden Math: why dependence inflates the t-stat**
> Start from how variance behaves under addition. For two random variables,
> $$ \text{Var}(X + Y) = \text{Var}(X) + 2\,\text{Cov}(X, Y) + \text{Var}(Y). $$
> When $$ X $$ and $$ Y $$ are independent, $$ \text{Cov}(X, Y) = 0 $$ and the variances simply add. The t-test is built on exactly this clean addition. But a cumulative sum has enormous positive covariance between neighbors, so the true variance of the path is far larger than the independent-case formula assumes. The test plugs in $$ s / \sqrt{n} $$ as if the covariance terms were zero — it *underestimates the standard error severely*. A too-small denominator produces a monstrously large $$ t $$. That is exactly where $$ \pm 12 $$ and $$ \pm 23 $$ came from: not a strong effect, but a denominator computed under an assumption that was violated.

The deeper lesson is that the original test was not testing PEAD at all. It was asking, thirty dependent ways, "did this one stock drift?" — a question about a single path, not about a phenomenon.

But there is a more basic confusion underneath, and it is the one I promised in the intro — the belief that computing the standard deviation correctly would let the test take care of the rest. That belief is wrong in a precise and instructive way.

> **A Common Misread: the standard deviation does not contain the covariance**
> My instinct was: doesn't squaring the standard deviation give variance, and doesn't variance absorb the covariance terms? It does — but only for the variance of a *sum*. The sample standard deviation $$ s $$ is not a sum of the points; it measures how far each point sits from the mean, $$ s^2 = \frac{1}{n-1}\sum_i (x_i - \bar{x})^2 $$, with no cross term $$ x_i x_j $$ anywhere. So $$ s $$ has no slot for covariance and assumes nothing about independence — it honestly reports the spread. The independence assumption sneaks in one step later, when $$ s $$ is divided by $$ \sqrt{n} $$ to estimate the standard error of the *mean*, because the mean **is** a sum, $$ \bar{X} = \frac{1}{n}\sum_i X_i $$, and its true variance is
> $$ \text{Var}(\bar{X}) = \frac{1}{n^2}\Big(\sum_i \text{Var}(X_i) + \sum_{i \neq j}\text{Cov}(X_i, X_j)\Big). $$
> Note the capital $$ X_i $$: covariance is defined between *random variables*, not between two numbers already observed. The clean $$ s/\sqrt{n} $$ is what you get only when every $$ \text{Cov}(X_i, X_j) = 0 $$ — when the observations are independent. A CAR path is the opposite: $$ X_i = \text{CAR}_i $$ and $$ \text{CAR}_2 = \text{CAR}_1 + r_2 $$, so neighbors carry enormous positive covariance and those terms refuse to vanish. The sharpest way to say it is the thing that finally made it click for me: feeding one event's 30-point path into the test is not "thirty independent observations" — it is *one drift, looked at thirty times*, dressed up as thirty. The test divides by $$ \sqrt{30} $$ as if it held thirty independent draws, when the independent information is closer to one. That is why no amount of computing $$ s $$ "correctly" could have saved it: the error was never in $$ s $$, it was in the $$ \sqrt{n} $$ that silently assumed independence I did not have.

## The real unit of analysis

PEAD is not a claim about one stock. It is a **cross-event** claim: *across many positive-surprise events, the average drift is greater than zero.* Once you say it that way, the fix becomes obvious — and it is not a fix to the test, it is a fix to what counts as an observation.

> **Unit of Analysis: the quietest decision in any test**
> Every statistical test silently answers "what is one observation?" before it does anything else. My broken code answered *"one observation = one day,"* so a single event contributed thirty dependent points and the test collapsed. The correct answer is *"one observation = one event."* Then each event contributes exactly **one number** — the terminal cumulative abnormal return $$ \text{CAR}_{t+30} $$, which summarizes the whole 30-day drift. I am not trying to *remove* the dependence among the thirty within-event points; I am declining to use them as my sample at all. The dependence does not get smaller — it becomes *irrelevant*, because the independence I now need lives between *different* events (Apple's Q2, Microsoft's Q1, and so on), which do not share partial sums.

With that, the rebuild is two layered changes. First, **what** I test: collect one terminal CAR per event into a cross-event sample, instead of testing a per-stock path. Second, **which** test: a one-sample, one-sided test against zero, because PEAD predicts a *direction* (upward), not merely "different from zero":

```python
t_stat, p_value = ttest_1samp(terminal_cars, 0, alternative='greater')
```

The `alternative='greater'` handles the one-sided question directly, retiring the awkward manual `p_value / 2` from the old code. Sanity check: the t-stat dropped from $$ \pm 23 $$ down to about $$ -1.16 $$. The bug was genuinely gone. In a large sample, a small $$ |t| $$ does not mean "I failed to see an effect" — it means "I looked, with plenty of data, and there is none." That distinction set up everything that followed.

## The diagnostic journey

A negative t-stat with $$ N = 1060 $$ events is not a green light to declare "PEAD runs backward." It is an invitation to ask *why*. What follows is a chain of hypotheses, most of which the data killed — and the killing is the point.

The first three numbers already told a story: mean terminal CAR $$ -0.0020 $$, but **median** $$ +0.0009 $$, with only $$ 51\% $$ of events positive. A mean and median of opposite sign means a left-skewed distribution: most events sit near zero, while a few extreme negatives drag the mean down. So the negative sign was never evidence of reverse drift; it was contamination from a minority of events.

Bucketing events by surprise magnitude found the contamination precisely. The strongest-surprise bucket showed a surprise *range* up to **1671%** — which is impossible as a real earnings beat and only happens when the denominator (expected EPS) is near zero. An estimate of \$0.01 against an actual of \$0.18 explodes the ratio. That bucket was not "great earnings"; it was a set of events where the surprise *metric itself* had broken. Capping surprise at a sane threshold pulled the mean back to roughly zero and flipped the t-stat positive — but only to $$ +0.09 $$. Removing contamination explained why the mean was *negative*; it did not produce a *signal*.

That left two suspects. One was the surprise definition — but the raw data carried both `EPS Estimate` and `Reported EPS`, confirming the surprise was measured against analyst consensus, which is exactly right for PEAD. Suspect dismissed. The other was **event timing**: announcements released after the market close are first tradable the *next* session, so aligning the window to the calendar date can be off by a day. Inspecting the timestamps showed announcements clustered in two groups — after-hours *and* pre-market — meaning any fixed "+1 day" rule would misalign the two groups in *opposite* directions, plausibly cancelling the signal in the average.

This suspect felt strong, and the tempting move was to write the fiddly timezone-and-trading-calendar code to fix it. Instead I drew the **average CAR path** first — the most diagnostic picture in PEAD research — by averaging across events at each day $$ t+1, \dots, t+30 $$. The verdict was decisive *against* my own hypothesis:

| day | mean CAR |
|---|---|
| t+1 | $$ -0.0018 $$ |
| t+5 | $$ -0.0010 $$ |
| t+10 | $$ -0.0005 $$ |
| t+20 | $$ -0.0015 $$ |
| t+30 | $$ -0.0038 $$ |

If timing misalignment were the culprit, the first reaction day's large jump would sit inside the window and the path would show a visible step near $$ t+1 $$. It does not. The path is flat from day one — a narrow negative band that never lifts. **Timing was not the culprit.** Drawing the picture before doing the surgery saved me from writing careful code in service of a wrong theory.

> **Mathematical Nuance: what flatness rules out**
> The signal-to-noise ratio is the whole story. The mean terminal CAR is about $$ -0.2\% $$ while its standard deviation across events is $$ 5.5\% $$. The signal is roughly $$ 0.036 $$ of the noise. With $$ N \approx 1000 $$, the $$ \sqrt{n} $$ in the denominator is a magnifying glass — a real effect of even modest size would surface as a respectable $$ t $$. It does not surface. That is not "underpowered"; it is "powered, and empty."

The honest conclusion is unglamorous: **in this sample, the PEAD drift is simply absent.** And that actually agrees with theory once you look at the universe — NVIDIA, Alphabet, Apple, Microsoft, Amazon. These are the most-watched megacaps on earth, where thousands of analysts price in information instantly. PEAD has always been strongest in *small, lightly-covered, less-liquid* stocks. Finding no drift in megacaps is not a contradiction of the theory; it is a confirmation of where the theory says drift should *not* be.

## How I would extend this

The path forward almost chooses itself: **swap the universe for smaller-cap stocks** and rerun the identical pipeline. I am choosing this over a more ambitious move — piling on extra conditioning variables (prior-quarter EPS trends, market regime, and so on) — for a deliberate reason. Changing only the cap size is a *controlled experiment*: if the signal reappears, "megacap efficiency" is confirmed as the explanation, because nothing else moved. Adding five variables at once would leave me unable to say which one mattered if the signal showed up — or stayed hidden.

And there is a trap waiting precisely here, the one I could feel before I could name it: the urge to keep changing variables *until a signal appears.* This is dangerous not because it wastes time but because it manufactures false signals. At the $$ 5\% $$ level, one in twenty tests is significant by pure chance, so sweeping twenty variable combinations will hand me a "discovery" that is nothing but noise — and a person who *wants* a signal will stop exactly there and believe it. That is p-hacking, and it is the single biggest reason empirical finance fails to replicate. The defense is counterintuitive: not searching faster, but committing to a rule *before* I look. Write the hypothesis and its falsification condition first; accept the one result; and when I eventually do sweep many variables, correct for multiplicity (Bonferroni, or controlling the false discovery rate) so that twenty attempts face a stricter bar than one.

When I left for the military, the market moved without me and I could only watch. What I am building now is the opposite posture — not predicting where a price goes, but learning to ask a question so carefully that the answer, even when it is "no," is one I can trust. The first honest "no" is already worth more than the $$ \pm 23 $$ that started all this.

---

## Appendix: the rebuilt script

This is the cleaned-up version after the rebuild — the cross-event design the post argues for, with the surprise cap applied and the dead code removed. The window is [t+1, t+30] (the announcement-day jump is the immediate reaction, not drift, so it is excluded), and the per-event statistic is the terminal CAR, tested across events with a one-sample, one-sided t-test. The exploratory diagnostics (surprise buckets, the average-CAR path, the percentile checks) lived in the same script while I was hunting the problem, but they are left out here so the appendix shows the final test cleanly rather than the scaffolding around it.

```python
import yfinance as yf
import pandas as pd
import statsmodels.api as sm
from scipy.stats import ttest_1samp
import numpy as np

# 1. Load data and set parameters
earn_call_raw = pd.read_csv("earn_cal_df.csv")
earn_call = earn_call_raw[earn_call_raw["Surprise(%)"] > 0].reset_index(drop=True)  # positive surprises only
market_ticker = "^GSPC"   # S&P 500
t_days = 30               # holding window length (trading days)
estimation_days = 250     # market-model estimation window (trading days)
buffer_days = 20          # gap between estimation window and the event
surprise_cap = 100        # drop denominator-explosion artifacts (expected EPS near zero)

# Cross-event sample: one terminal CAR per event
event_terminal_cars = []

# 2. Per-event loop
for idx, row in earn_call.iterrows():
    ticker = row["Symbol"]
    surprise = row["Surprise(%)"]

    # Skip surprise outliers: huge values come from a near-zero EPS denominator,
    # not from a genuinely large beat.
    if surprise > surprise_cap:
        continue

    event_date_str = row["Event Start Date"][:10]   # keep the calendar date only
    event_date = pd.to_datetime(event_date_str)

    # Download a generous price window around the event
    start_date = event_date - pd.DateOffset(days=400)
    end_date = event_date + pd.DateOffset(days=50)

    try:
        data = yf.download([ticker, market_ticker], start=start_date, end=end_date)["Close"]
        returns = data.pct_change().dropna()
        returns.columns = ["Market", "Stock"]

        # Locate the event date among trading days
        try:
            event_idx = returns.index.get_loc(event_date)
        except KeyError:
            print(f"{ticker}: {event_date_str} is not a trading day. Skipping.")
            continue

        # Estimation window: from 250 days before to 20 days before the event
        est_start = max(0, event_idx - estimation_days)
        est_end = max(0, event_idx - buffer_days)
        estimation_window = returns.iloc[est_start:est_end]

        if len(estimation_window) < 50:
            print(f"{ticker}: not enough estimation data. Skipping.")
            continue

        # Event window: [t+1, t+30] — the day AFTER the announcement through t+30.
        # The announcement-day jump is the immediate reaction, not drift, so it is excluded.
        event_start = event_idx + 1
        event_end = event_idx + 1 + t_days
        event_window = returns.iloc[event_start:event_end]

        if len(event_window) < t_days:
            print(f"{ticker}: not enough event data. Skipping.")
            continue

        # Market-model OLS: Stock ~ alpha + beta * Market, fit on the estimation window
        X_est = sm.add_constant(estimation_window["Market"])
        y_est = estimation_window["Stock"]
        model = sm.OLS(y_est, X_est).fit()

        # Abnormal returns over the event window, then cumulative AR
        X_event = sm.add_constant(event_window["Market"])
        expected_return = model.predict(X_event)
        ar = event_window["Stock"] - expected_return
        car = ar.cumsum()

        # The per-event statistic is the TERMINAL CAR (total 30-day drift),
        # one number per event — this is the cross-event sample unit.
        event_terminal_cars.append(car.iloc[-1])

    except Exception as e:
        print(f"{ticker}: error during processing: {e}")
        continue

# 3. Cross-event test
# PEAD as a phenomenon: is the AVERAGE terminal CAR across events > 0?
# One-sample (vs a fixed 0), one-sided (greater) — matching the directional prediction.
car_array = np.array(event_terminal_cars)
t_stat, p_value = ttest_1samp(car_array, 0, alternative="greater")

print(f"N events          = {len(car_array)}")
print(f"mean terminal CAR = {car_array.mean():.4f}")
print(f"t-statistic       = {t_stat:.4f}")
print(f"p-value (>0)      = {p_value:.4f}")
```