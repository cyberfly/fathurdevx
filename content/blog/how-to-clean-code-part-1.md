---
title: "How to write Clean Code - Part 1"
slug: how-to-clean-code-part-1
date: 2024-02-06
description: "Tips to write clean and maintainable code"
tags:
  - Tutorial
category: DEVELOPMENT
author:
  name: Fathur
  avatar: https://api.dicebear.com/7.x/avataaars/svg?seed=Felix
  bio: Frontend engineer obsessed with micro-interactions and making the web feel "alive".
---

# How to write Clean Code - Part 1

In this post, I will share with you some useful tips on how to write clean and easy to maintain code. We will use Javascript as examples since it is the most widely used programming language and easy to understand.

### Initial code

This is the initial code before you start updating it.

```
function getPost(post_id) {

  const category = 'car';
  const featured_image_url = null;

  const post = {
    title: 'dummy title',
    body: 'dummy body',
    category: category,
    featured_image_url: featured_image_url,
  };

  return post;
}
```

### Requirements

1. Based on the post category as a keyword, search for an image from the Pexels API.
2. Use the image URL as the value for `featured_image_url`.

### Updated code - V1

Let's say, for the first iteration, you write something like this, by separating the Pexels API codes into a dedicated function.

```
function getPost(post_id) {

  const category = 'car';
  const featured_image_url = getFeaturedImageUrl(category);

  const post = {
    title: 'dummy title',
    body: 'dummy body',
    category: category,
    featured_image_url: featured_image_url,
  };

  return post;

}

function getFeaturedImageUrl(keyword) {
  const apiKey = 'PEXELS_API_KEY';
  const apiUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=10`;

  const featured_image = fetch(apiUrl, {
      headers: {
        'Authorization': apiKey,
      }
    })
    .then(response => {

      const response_data = response.json();

      const first_image = response_data.photos[0];

      return first_image;
    })

  // return image url
  return featured_image.src.medium;
}
```

### Issues

1. The function `getFeaturedImageUrl()` has too much responsibility; it needs to fetch images from the API, and it also has logic on how to return the image URL. What if we need to add more requirements later?

2. Pexels API response inside `getFeaturedImageUrl()` contains an array of images, but the function only returns a single image URL. What if other code needs to get an array of images from Pexels? This function cannot be reused because it only returns a single URL.

### Updated code - V2

Let's refactor the code to address the mentioned issues.

```

function getFeaturedImageUrl(keyword) {

  const keyword_images = getPexelImages(keyword);

  const first_image = keyword_images[0];

  return first_image.src.medium;
}

function getPexelImages(keyword) {
  const apiKey = 'PEXELS_API_KEY';
  const apiUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=10`;

  const keyword_images = fetch(apiUrl, {
      headers: {
        'Authorization': apiKey,
      }
    })
    .then(response => {

      const response_data = response.json();

      return response_data.photos;
    })

  return keyword_images;
}
```

### Explanation

1. `getFeaturedImageUrl()` now only has a single responsibility - how to return the image URL.

2. `getPexelImages(keyword)` now only has a single responsibility - how to return Pexels images.

### New Requirements

Your manager then comes with new requirements:

1. The featured image must be hosted on Amazon S3.

### Updated code - V3

By following the same concept, we just need to add a new function called `getS3Image(image)`, and let getFeatureImageUrl() utilize it.

```
function getFeaturedImageUrl(keyword) {

  const keyword_images = getPexelImages(keyword);

  const first_image = keyword_images[0];

  const image_s3 = getS3Image(first_image);

  return image_s3.url;
}

function getPexelImages(keyword) {
}

function getS3Image(image) {
  // logic to upload into S3
  // return S3 image data
}
```

### Flexibility

We now have more flexibility with our code.

1. Pexels images can now be reused elsewhere by calling `getPexelImages`. Example:

```
function getHeroImages() {
  const images = getPexelImages('corporate');

  return images;
}
```

2. If the requirement changes again, and we don't need the S3 Image anymore, just comment out the part of calling the function. Example:

```
function getFeaturedImageUrl(keyword) {

  const keyword_images = getPexelImages(keyword);

  const first_image = keyword_images[0];

  /*
  const image_s3 = getS3Image(first_image);
  return image_s3.url;
  */

  return first_image.src.medium;
}
```

You should notice by now that `getPost()` only changed once because all the image-related codes were handled by `getFeaturedImageUrl()`. Awesome!

### Less Responsibility

Let's summarize the responsibility for each function:

| Function            | Responsibility                                                               | Responsibility Count |
| ------------------- | ---------------------------------------------------------------------------- | -------------------- |
| getPost             | Getting the post, with the image handling delegated to getFeaturedImageUrl() | 1                    |
| getFeaturedImageUrl | Returning the image URL                                                      | 1                    |
| getPexelImages      | Returning Pexels images                                                      | 1                    |
| getS3Image          | Getting the S3 image                                                         | 1                    |

### Conclusion

1. Try to give less responsibility to a function or class. The less, the better!

2. Adopt a modular design where each function has a single responsibility. This makes the code more maintainable and flexible to accommodate future changes.

3. The examples in this post, of course, can still be optimized, but for this tutorial, this is enough to give you the idea on how to improve your code.
