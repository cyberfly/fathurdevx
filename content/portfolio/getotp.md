---
title: "GetOTP"
slug: getotp
date: 2023-12-01
description: "GetOTP is an OTP as a Service that provides OTP for developers"
category: Web App
heroImage: /images/getotp2.png
tags:
  - HTMX
  - Alpine
  - Django
  - TailwindCSS
liveUrl: https://getotp.me
sourceUrl: #
order: 5
challenge: "Developers often find implementing secure and reliable OTP systems complex and time-consuming, requiring significant backend infrastructure."
solution: "Built a streamlined OTP-as-a-Service platform using Django and HTMX, providing an easy-to-integrate API for developers to add secure authentication to their apps."
---

# GetOTP - OTP as a service

GetOTP is a low-code solution to easily implement OTP functionality into your app.

Many projects at LaLoka Labs Co have OTP functionality, so we decided to package it as Software as a Service and make it available to our customers.

For this project, I used HTMX and AlpineJS to implement interactive UI in the members area.

One of the interesting features that I needed to develop is Live Theme Customization.

With the help of HTMX, minimal JavaScript is used to build these features.

I also wrote the documentation for GetOTP, which can be found on the Docs page.

## Preview

![GetOTP Home](/images/getotp2.png)
![GetOTP Home](/images/getotp1.png)

## Live Site

https://otp.dev/en/

### WordPress plugin

I proposed that we build a WordPress plugin since this is where the biggest low-code audiences reside.

I then developed and successfully published the plugin, which can be found here.

https://wordpress.com/plugins/getotp-otp-verification

### Blog module

GetOTP blog is powered by WordPress Rest API. I then wrote the Python code to consume the Rest API and presented it as a blog page inside the GetOTP website.
