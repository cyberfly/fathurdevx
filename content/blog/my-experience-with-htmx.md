---
title: "My experience with HTMX"
slug: my-experience-with-htmx
date: 2024-01-20
description: "My experience with HTMX and my thought about it"
tags:
  - Web Development
category: DEVELOPMENT
author:
  name: Fathur
---

# My experience with HTMX

So I have been using HTMX in production for the last 2 years. In this post, I would like to share my experience and opinion regarding HTMX.

## Backend Developer wet dream

First, let's see why HTMX become so popular with Backend Developer

- Backend Developer hates Javascript and is more productive with traditional server-side rendering
- HTMX examples show that developers can implement Reactive UI without writing Javascript and just use server-side rendering, awesome!

### The problem

Reactive UI without writing Javascript is super cool, but it can go out of hand very fast. Soon you will see code that doing a round trip to API, just to show and hide div. When compared to javascript toggle show and hide, the HTMX solution is more complicated and quite slow!

## Wait, What?

Soon enough when building more complex features, developers will realize they still need to write Javascript! Oh no!

### State management responsibility

Another misconception among developers is that HTMX magically removes application state from the Front End code. In reality, HTMX just moves the responsibility of the application state from the Front End to the Back End.

As a result, your Back End code will grow larger even though your Front End code becomes slimmer.

### When is the right time to use Javascript?

Now that you realize that you still need to write Javascript, comes this question:

- For this feature, do I use HTMX and mix it with Javascript? Or do I just fully write Javascript?

### Taking the Middleground Approach

I have adopted this strategy and it seems to work beautifully:

- When there is a need for an AJAX call and render the data response, use HTMX.
- When you usually don't need AJAX call, just use Javascript. Don't add new API endpoint just because you want to use HTMX. For example toggling show/hide or enable/disable.

By following the strategies above, HTMX codes can be more maintainable.

### Conclusion

Building reactive applications with HTMX is awesome. It saves a lot of development time when compared to modern Javascript frameworks such as React and Vue.

However, we just need to be aware of the common pitfalls that were described above

In a future blog post, I will share more tips and tricks for using HTMX. Stay tuned!
