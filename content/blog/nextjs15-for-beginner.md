---
title: "NextJS 15 for Beginner"
slug: nextjs15-for-beginner
date: 2025-09-21
description: "NextJS 15 for Beginner"
tags:
  - Tutorial
  - Javascript
  - NextJS
  - ReactJS
category: DEVELOPMENT
author:
  name: Fathur
  bio: Frontend engineer obsessed with micro-interactions and making the web feel "alive".
---

# NextJS 15 for Beginner

This blog post served as a note for future me incase I already forget about NextJS and ReactJS. Happy reading!

### Routing

```
app/
  layout.tsx          <-- Global layout (applies to all pages)
  page.tsx            <-- Home page  (route: "/")
  about/
    page.tsx          <-- About page (route: "/about")
  blog/
    page.tsx          <-- Blog index (route: "/blog")
    [id]/
      page.tsx        <-- Blog dynamic route (route: "/blog/123")
```

### Seeder

### ORM

### Migration

### Basic ReactJS syntax

Loop (Rendering a list)

```
export default function ListPage() {
  const fruits = ["Apple", "Banana", "Orange"];

  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}
```

Conditional rendering

```
export default function App() {
  const showMessage = true;

  return (
    <div>
      {showMessage && <p>This will show only if `showMessage` is true</p>}
    </div>
  );
}
```

Conditional rendering (Ternary)

```
export default function App() {
  const isLoggedIn = true;

  return (
    <div>
      {isLoggedIn ? <p>Welcome back!</p> : <p>Please log in</p>}
    </div>
  );
}
```

Event handling with Parameters

```
export default function App() {
  const handleClick = (e, id) => {
    e.preventDefault(); // example: stop default link behavior
    console.log("Clicked ID:", id);
  };

  return (
    <a href="#" onClick={(e) => handleClick(e, 42)}>
      Click with Event + ID
    </a>
  );
```

### Starter

### Conclusion

I hope this post has been helpful in your journey to mastering NextJS. Happy coding!
