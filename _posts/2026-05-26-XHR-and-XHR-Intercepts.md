---
layout: post
title: "Reading Your Own Mail: What XHR Interception Actually Is"
date: 2026-05-26
description: "Starting from a simple question—where does all this data come from?—a math student's tour through XHR/Fetch interception, the client-server trust boundary, stateless HTTP, and why location (not the tool) decides whether you're debugging or attacking."
tags: [xhr, fetch, web-security, networking, javascript, monkey-patching]
categories: [security, web]
---

I was refreshing a page for the hundredth time when a dumb little question stopped me: *where does all this data actually come from?* The headlines, the timestamps, the little list that re-renders when I type—none of it arrived with the page. It showed up afterward, quietly, from somewhere. And then the question that actually started this whole thing: when a letter arrives in my mailbox, I just open it. Could I receive *this* data the same way—directly, before the page dresses it up for me?

That question turns out to have a precise, well-mapped answer in network and security theory. This post is me walking through it, as a math student who knew algorithms and Linux tools but had never once opened the Network tab. If that's you too, good. Let's open the mail.

## The setup: a page is really two systems pretending to be one

Here's the first thing that reorganized my mental model. The modern web page you look at is not one program. It's **two**:

- a **frontend**: the HTML/CSS/JavaScript that paints pixels, and
- a **backend API**: a separate service whose entire job is to hand out structured data (usually JSON).

When you hit "search," the frontend doesn't compute the results. It fires a background request to the API, receives a blob of JSON, and *then* renders it into the tidy list you see. The pretty page is the last step, not the source.

To play with this safely, I built a tiny version of exactly that shape on my own VM—a FastAPI backend exposing one endpoint, `/api/articles-by-search`, and a one-page frontend that calls it. Everything below is run against *my own* server, which matters more than it sounds like. We'll get to why.

## XHR, Fetch, and "interception"

**Definition.** **XHR** stands for `XMLHttpRequest`—a browser mechanism, dating to the early 2000s, that lets a page exchange data with a server *in the background, without reloading the whole page*. Its modern successor is the `fetch` API. Together they're the machinery behind AJAX and every Single Page Application (SPA). In your browser's DevTools, the `Fetch/XHR` filter in the Network tab is showing you exactly these requests.

**Intuition.** Before XHR, clicking a link meant the entire page went blank and reloaded. XHR is what made "the list updates but the page doesn't flicker" possible. It split the *conversation with the server* away from the *repainting of the screen*.

**XHR interception**, then, is the act of stepping into that background conversation—observing or altering the request/response before the page gets to dress it up.

> **Design Trade-off — why split the page into two systems at all?**
> Coupling rendering and data-fetching into one server-rendered page is simpler to reason about, so why did the web move to this two-system SPA design? The trade-off buys you three things: the backend becomes a reusable data source (the same API can feed a website, a mobile app, and my little script equally), the frontend becomes responsive (update a fragment, not the world), and the two halves can be developed and scaled independently. The cost you pay is precisely the thing this post is about: a clean, observable seam opens up between them. The JSON now travels across a boundary you can stand inside. Good architecture and "interceptable" are the *same* property viewed from two sides.

## The core picture: the client–server trust boundary

Almost all of network security reasoning starts from one diagram:

```
[ client ] <------ network ------> [ server ]
 (browser)     (this part is hostile)   (API backend)
```

The founding assumption is blunt: **the network in the middle is untrusted.** Between leaving the client and reaching the server, data passes through routers, ISPs, that café Wi-Fi access point, proxies—any of which *could* be watching or interfering. You design as if someone is.

Standing in that middle position is what "interception" means in the security sense, and it comes in two flavors:

- **Passive interception (eavesdropping):** you look, you don't alter. The flow continues unchanged.
- **Active interception (tampering):** you modify, inject, or block.

That distinction isn't academic—it's why there are two *different* defenses later: you stop eavesdropping with **encryption**, and you stop tampering with **integrity checks**.

## Where interception happens decides what it *means*

This is the idea I most want to plant, because it's the one that finally made the legal/ethical line make sense to me—not as a rule someone imposed, but as a consequence of the structure.

The *same technique* has completely different meaning depending on **where** you stand:

**(a) Inside the endpoint — the client watching its own traffic.**
This is the mailbox case. You are reading data that was *already, legitimately, delivered to you*. Watching your own browser's responses is not a threat to anyone, because you are the rightful recipient. Opening your own mail is not interception in any adversarial sense at all.

**(b) On-path — a third party wedged into the network middle.**
This is the famous **Man-in-the-Middle (MITM) attack**. Someone sits between client and server and reads or rewrites both sides of a conversation they were never part of. (The `mitm` in tools like *mitmproxy* is literally this acronym.)

Here's the subtlety that took me a second: the *tooling* for (a) and (b) overlaps almost entirely. The thing that flips one into the other is **position and consent**—am I standing inside my own endpoint looking at my own traffic, or have I inserted myself into someone else's conversation without their agreement?

> **The Hidden Math — "location decides legality" is an equivalence-class statement.**
> This felt fuzzy until I phrased it the way I'd phrase anything else. Take the set of all "look at the bytes" actions. Define a relation: two actions are equivalent if they're *technically* identical (same `clone()`, same proxy, same packet read). Under that relation, debugging-my-own-traffic and MITM-ing-a-stranger land in the *same equivalence class*—the technique can't tell them apart. So "is this okay?" simply **is not a function of the technique**; the technique is constant across the class. The thing that *does* vary—and therefore the only thing that can determine permissibility—is the pair (position, consent). When a question is invariant under the feature you were staring at, you're staring at the wrong feature. That's why "but it's the same code" is never an answer to "was I allowed to."

So when I run interception against *my own VM*, I'm squarely in case (a). That's not a loophole I'm exploiting; it's the whole reason the exercise is clean.

## The technique: monkey-patching `fetch`

The most direct way to watch the conversation from inside the page is **monkey-patching**: replacing an existing function, at runtime, with a wrapper that preserves the original behavior but slips your code in around it.

**Definition.** In JavaScript, functions are *first-class values*—you can store one in a variable and reassign it. `window.fetch` is just a function value hanging off the global object. So you can grab the original, stash it under another name, and put your own wrapper in its place.

**Intuition.** It's function composition. If the original is \( f \), you install

$$ f'(x) = (\text{after} \circ f \circ \text{before})(x) $$

where `before` peeks at the arguments (the outgoing request) and `after` peeks at the result (the incoming response), while \( f \) itself runs untouched in the middle.

```javascript
// (1) Keep the original under a new name. Like g = f before we reassign f.
const originalFetch = window.fetch;

// (2) Put a wrapper where window.fetch used to be — this is the monkey-patch.
window.fetch = async function (...args) {
  const [url, options] = args;
  console.log('-> request out:', url, options || '');   // before

  // (3) Call the real fetch, passing every argument through untouched.
  const response = await originalFetch.apply(this, args);

  // (4) Clone before reading — the body is a single-use stream (see below).
  const clone = response.clone();
  clone.json()
    .then(data => console.log('<- response JSON:', data))   // after
    .catch(() => {/* not JSON, ignore */});

  // (5) Hand the untouched original back to the page. It never notices.
  return response;
};
console.log('fetch interceptor installed.');
```

Paste that into the DevTools **Console** while sitting on your own page, run a search, and the raw JSON shows up in the console *before* it ever becomes a list item—including fields the page chose not to display. That's the mail, opened on arrival.

> **The Hidden Math — why `clone()` is not optional.**
> The `response.clone()` line looks like defensive boilerplate, but it's forced by a real constraint: an HTTP response body is a **stream**, and reading it (`.json()`, `.text()`) *consumes* it. Model the body as a resource with a use-count of exactly one. The page also intends to spend that one read to render the results. If my interceptor reads first, the page's read fails; if the page reads first, mine does. There is no interleaving that lets a single-use resource satisfy two independent consumers. `clone()` resolves it by producing a second, independent stream so each consumer gets its own. The deeper "why a stream at all?" is a memory bet: a response might be a multi-gigabyte video, and you'd rather process it as it flows than hold the whole thing in RAM. Single-use is the price of not assuming everything fits in memory.

A second small but deliberate choice: in step (4) I used `.then(...)` instead of `await`. If I had `await`-ed the clone's body before returning, the page would be stuck waiting for *my* snooping to finish before it got its response. Pushing the peek into a `.then` callback lets the real response return immediately and the observation happen alongside it. A passive interceptor should disturb the original flow as little as possible.

## Stateless HTTP, and the real identity of "the cookie"

This is the part I'd most wondered about, and it has a clean theoretical core.

**Definition.** HTTP is fundamentally **stateless**: the server treats every request as an independent, first-time stranger. Request A and request B are, by default, unrelated as far as the protocol is concerned.

**Intuition.** But "staying logged in" obviously exists—so state is being *layered on top* of a stateless protocol. The mechanism is sessions and cookies:

1. You log in once; the server verifies you and issues a **session token**—a long random string.
2. The browser stores it as a **cookie** and *automatically attaches it to the header of every subsequent request*.
3. On each request the server reads the token and goes "ah, it's you again," reconstructing continuity it doesn't natively have.

So a session is a function from token to identity, evaluated fresh on every request, faking persistence over a protocol that has none.

> **The Hidden Math — a cookie is a memoized identity lookup.**
> Re-deriving "who is this and are they authenticated?" from scratch on every request would mean re-running the whole login computation each time—an expensive pure function of your credentials. The session token is the cached key into a lookup table the server keeps: present the key, get the precomputed identity back in O(1) instead of recomputing it. Stateless HTTP plus a session store is just **memoization**—trading a bit of server-side memory to avoid recomputing an expensive result on every call. Which immediately tells you where the danger lives: in memoization the cache key *is* the credential. Anyone holding the key gets the cached answer, no questions asked. That's why a leaked session token is as good as a password (this is **session hijacking**), and why cookie attributes like `HttpOnly`, `Secure`, and `SameSite` exist—they're all about keeping the cache key from leaking to the wrong holder.

Worth separating two ideas the token touches. **Authentication** answers "who are you?"—the token proves identity. **Authorization** answers "are you allowed to do this?"—a well-built API enforces it *separately*, so that even a valid token can't reach data outside its permissions.

## The honest correction I owe this post

When I first poked at a real site's background requests, I described it to myself as "checking the API through the developer tab." That phrasing was wrong in a way worth fixing, because it blurs two very different things:

- a **public, documented developer API**—an endpoint a company *publishes and licenses* for programmatic use, with terms and stability guarantees; versus
- an **observed internal endpoint**—the private URL a site calls for its own frontend, which I happened to *watch* in the Network tab.

They look similar in DevTools and behave nothing alike in practice. The internal one carries no promise of stability (it can change without notice and break everything built on it) and, on someone else's site, automating against it with a reused login session is a different conversation entirely—about terms of service and consent, i.e. squarely case (b) territory. None of *that* is what this post is about. Everything here ran against my own VM, where I'm the rightful recipient of my own mail. The interesting structure survives completely intact without ever leaving case (a).

## What I actually want to build from here

The plan that's forming isn't "intercept more aggressively"—it's to **build the other side of the boundary and attack my own design.** Concretely: add a real login endpoint to my mini app, issue a genuine session token, and make the API reject unauthenticated requests with a `401`. Then put on the analyst hat, pull my own token out of the cookie header, and reconstruct an authenticated request by hand from a script.

The reason that's the right next move: it closes the loop on this whole post. It turns the cookie from a mysterious string into a memoization key I issued myself; it makes the `401`/`200` boundary the *authentication* concept I can touch; and because it's all my server, I can build a deliberately leaky version and a properly hardened one and diff them. The best way to understand a defense is to be the one who has to build it after watching how easily the undefended version gives up its mail.

And there's a satisfying symmetry to end on. I started by wanting to receive my own data the way I open my own mail. The natural finish is to become the post office for a moment—to issue the tokens, stamp the envelopes, and decide who gets to open what. You don't really understand a mailbox until you've also had to run the mailroom.