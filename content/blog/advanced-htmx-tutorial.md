---
title: "Advanced HTMX Techniques for Web Developers"
slug: advanced-htmx-tutorial
date: 2024-11-04
description: "Advanced HTMX Techniques and Tips"
tags:
  - Tutorial
  - Javascript
  - HTMX
category: DEVELOPMENT
author:
  name: Fathur
---

# Advanced HTMX for Web Developers

HTMX is a great library that allows you to build modern web applications without the complexities often associated with JavaScript frameworks.

In this post, I’ll be sharing some advanced HTMX techniques and tips that I’ve discovered along the way.

### Attaching Fields to an HTMX Request Payload

When sending a request to the server with HTMX, you can attach additional fields to the request payload by using the `hx-include` attribute.

```
<input id="first_name" type="text" name="first_name" />
<input id="email" type="text" name="email" />

<button
  hx-post="/api/action"
  hx-include="#first_name, #email"
>
  Submit
</button>
```

### Inline HTMX events

HTMX has a dedicated documentation page on HTMX events, but it currently lacks examples for inline events.

To use inline events in HTMX, simply apply the `hx-on` attribute and use snake case for the event name. For instance, `beforeRequest` becomes `before-request`.

Here’s an example based on the documentation found at HTMX Events:

| **Event**              | **Inline Event (`hx-on`)**    |
| ---------------------- | ----------------------------- |
| `htmx:beforeRequest`   | `hx-on:htmx:before-request`   |
| `htmx:configRequest`   | `hx-on:htmx:config-request`   |
| `htmx:beforeOnLoad`    | `hx-on:htmx:before-on-load`   |
| `htmx:afterOnLoad`     | `hx-on:htmx:after-on-load`    |
| `htmx:beforeSwap`      | `hx-on:htmx:before-swap`      |
| `htmx:afterSwap`       | `hx-on:htmx:after-swap`       |
| `htmx:beforeSettle`    | `hx-on:htmx:before-settle`    |
| `htmx:afterSettle`     | `hx-on:htmx:after-settle`     |
| `htmx:responseError`   | `hx-on:htmx:response-error`   |
| `htmx:sendError`       | `hx-on:htmx:send-error`       |
| `htmx:invalidResponse` | `hx-on:htmx:invalid-response` |
| `htmx:triggered`       | `hx-on:htmx:triggered`        |
| `htmx:load`            | `hx-on:htmx:load`             |

Example usage

```
<button
  hx-post="/api/action"
  hx-on:htmx:before-request="return confirm('Are you sure?')"
  hx-on:htmx:after-request="alert('Deleted!')"
>
  Delete
</button>
```

### Event Delegation

A common pattern with HTMX is to return a partial HTML file in response to an HTMX request.

For example, if you have a partial template called `form.html`, you can return this partial with previously entered fields and field-specific error messages if backend validation fails.

```
<div>
  <!-- include form.html -->
  <form
    hx-post="/api/action"
    hx-on:htmx:after-request="alert('Request finished!')"
    hx-on:htmx:after-swap="alert('Dom Updated!')"
    >

  </form>
  <!-- end include form.html -->
<div>
```

The issue with the example above is that the `htmx-after-request` and `htmx-after-swap` event won’t work because the original HTML is replaced by the new response HTML.

To resolve this, you can use event delegation by moving the event listener to a parent element. This ensures that the event will continue to work, even after the content is replaced.

```
<div
  hx-on:htmx:after-request="alert('Request finished!')"
  hx-on:htmx:after-swap="alert('Dom Updated!')"
  >
  <!-- include form.html -->
  <form
    hx-post="/api/action"
    >

  </form>
  <!-- end include form.html -->
<div>
```

### Multiple HTMX Event Callbacks

You can initialize multiple HTMX event callbacks by separating each callback name with a comma.

```
<button
  hx-post="/api/action"
  hx-on:htmx:after-request="setIsFormSubmitted(true), addClass('#myForm', 'active')"
>
  Delete
</button>
```

### Making JavaScript Callbacks Accessible to HTMX

To make your callback function accessible to an HTMX event, assign it to a `window` object.

```
window.setIsFormSubmitted = function (state) {
  // do something
};
```

### Common JavaScript Callbacks

Here are some common JavaScript callbacks that may be useful in your project.

```
window.setDisabled = function (element_id) {
  let element = $(element_id);

  element.prop("disabled", true);
};

window.setReadOnly = function (element_id) {
  let element = $(element_id);

  element.prop("readonly", true);
};

window.hideElement = function (element_id) {
  let element = $(element_id);
  element.hide();
};

window.showElement = function (element_id) {
  let element = $(element_id);
  element.show();
};

window.addClass = function (selector, className) {
  $(selector).addClass(className);
};

window.removeClass = function (selector, className) {
  $(selector).removeClass(className);
};

window.setFocus = function (selector) {
  $(selector).focus();
};

window.isEmpty = function (variable) {
  variable = $.trim(variable);

  return variable === undefined || variable === null || variable === "";
};

window.isFieldEmpty = function (id) {
  let value = $(id).val();

  return isEmpty(value);
};
```

### Automatic CSRF Token for HTMX Requests

Here’s how to automatically add a CSRF token to HTMX requests. Simply define this in your main JavaScript file:

```
// get CSRF token for Django

let token_el = document.getElementsByName("csrfmiddlewaretoken");
let csrf_token = token_el[0].value;

document.body.addEventListener("htmx:configRequest", (event) => {
  event.detail.headers["X-CSRFToken"] = csrf_token;
});
```

### Manually Triggering HTMX Requests

You can manually trigger an HTMX request using a custom JavaScript event. Here’s an example:

```
<form
  hx-post="/api/action"
  hx-trigger="submitKeywordSearch from:body"
>
</form>
```

In your JavaScript file, you can trigger an HTMX request based on user actions, like clicking a button. Here’s an example:

```
let event_payload = {};

document.body.dispatchEvent(new CustomEvent("submitKeywordSearch", event_payload));
```

This approach lets you initiate HTMX requests directly from JavaScript when a specific event occurs.

### Preventing HTMX Triggers with Custom Validation

You can prevent an HTMX trigger by using custom validation. Simply declare the condition within the trigger.

For example, this form will not be submitted if `search_query` is empty (isFieldEmpty is a custom function):

```
<form
  hx-post="/api/search"
  hx-trigger="submit[!isFieldEmpty('#search_query')]"
>
  <input type="text" name="search_query" id="search_query" />
  <button type="submit">Submit</button>
</form>
```

### Conditional polling with HTMX

Let's say you want to poll an API every 20 seconds to check the status of user submission, but you want to stop polling when the submission is ready.

Initial HTMX polling

```
<div
    hx-get="/api/submissions"
    hx-trigger="every 20s [FETCHING_SUBMISSION]"
    hx-on:htmx:after-request="fetchingSubmissionStatusAfterRequest(event)"
>
</div>
```

Initial JS state, since FETCHING_SUBMISSION is false, by default the polling will not start.

```
window.FETCHING_SUBMISSION = false;

function setIsFetchingSubmission(state) {
  window.FETCHING_SUBMISSION = state;
}
```

To trigger the polling, we just need to set FETCHING_SUBMISSION state to true.

```
document.body.addEventListener("newSubmissionAdded", (event) => {
  setIsFetchingSubmission(true);
});
```

Triggering the polling via user action

```
<form
  hx-post="/api/submissions"
  hx-on:htmx:after-request="submissionsAfterRequest(event)"
>
</form>

// the JS part

window.submissionsAfterRequest = function (e) {
  document.body.dispatchEvent(new Event("newSubmissionAdded"));
}
```

Stopping the polling. Each time the polling is triggered, we will check the status of the submission via hx-on:htmx:after-request. If the status is ready, we will stop the polling.

```
const HTMX_STOP_POLLING = 286;

window.fetchingSubmissionStatusAfterRequest =
  function (e) {
    const status = e.detail.xhr.status;

    if (status === HTMX_STOP_POLLING) {
      setIsFetchingSubmission(false);
    }
  };
```

### HTMX afterSwap event not working?

You should add the afterSwap event to the element that you want to swap, instead of the trigger element.

This will not work

```
<button
  hx-post="/api/action"
  hx-target="#content"
  hx-on:htmx:after-swap="addClass('#content', 'bg-yellow')"
>
  Submit
</button>

<div id="content"></div>
```

This will work

```
<button
  hx-post="/api/action"
  hx-target="#content"
>
  Submit
</button>

<div
  id="content"
  hx-on:htmx:after-swap="addClass('#content', 'bg-yellow')">
</div>
```

### Restarting HTMX Polling After It Has Been Stopped

Once HTMX polling is stopped, it cannot be restarted directly. To resume polling, you need to reload the HTMX element.

Here’s an example of how to reload the HTMX element.

Polling remains active until `FETCHING_TITLES` is set to `false`, at which point it will stop.

To restart polling, reload the HTMX element and set `FETCHING_TITLES` to `true`.

```
<div
    id="title_fetcher"
    hx-get="/api/action"
    hx-trigger="every 10s [FETCHING_TITLES]"
    hx-on:htmx:after-request="reloadHTMXElement('title_fetcher')"
    >
</div>
```

```
window.reloadHTMXElement = function (element_id) {
  const htmx_element = htmx.find(element_id);
  const clone = htmx_element.cloneNode();

  htmx_element.parentNode.insertBefore(clone, htmx_element);
  htmx.remove(htmx_element);
  htmx.process(element_id);
};
```

### Conclusion

HTMX is a powerful library that allows you to build modern web applications with minimal JavaScript.

By understanding these advanced concepts like proper event handling, event callback, and request triggering, you can create more robust and maintainable applications.

I hope this post has been helpful in your journey to mastering HTMX. Happy coding!
