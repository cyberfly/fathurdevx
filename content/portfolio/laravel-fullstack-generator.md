---
title: "FullStackMe - Laravel Full Stack Generator"
slug: laravel-fullstack-generator
date: 2023-02-25
description: "Generator to instantly generate Laravel API and Angular codes"
category: Developer Tool
tags:
  - Laravel
  - Angular
  - Bootstrap
liveUrl: #
sourceUrl: #
order: 6
challenge: "Building boilerplate code for CRUD applications across Laravel and Angular is repetitive and prone to human error, slowing down the initial development phase."
solution: "Created a powerful code generator that analyzes database structures to instantly produce production-ready Laravel controllers, models, and Angular components."
---

# FullStackMe - Laravel Full Stack Generator

## Background

Our main tech stacks at Nazrol Tech Sdn Bhd are Laravel API with Angular SPA.

As a Full Stack developer working with both Front End and Backend, there are a lot of things that need to be properly set up to ensure the project can run smoothly.

## Standard Process

After the database design, here is the standard process to build a Laravel + Angular app.

- Laravel Model and Relationship
- Laravel API Controller
- Laravel API Filter
- Laravel API Validation
- Laravel API Resource (transformer)
- Angular Service to consume API
- Typescript interface to API Response data
- Angular UI to interact with the data

## Solution

I built this generator that will output all the steps above in one click! Just connect to your database and customize the options if needed.

You can watch the implementation here.

<iframe
  class="embed_video"
  width="560"
  height="315"
  src="https://www.youtube.com/embed/hXkDyMNRJNc?si=-NWdxBXLYyg8Q0Mr"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
></iframe>

## Result

It speeds up our Laravel + Angular development by eliminating at least 30% of boilerplate code. Awesome!
