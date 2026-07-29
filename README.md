# Scroll Pagination React

A lightweight and easy-to-use React scroll pagination library for implementing infinite scrolling.

## ✨ Features

- 🚀 Lightweight
- ⚛️ React Friendly
- 📦 TypeScript Support
- 🎯 Easy API
- 🔄 Infinite Scroll Pagination

## Installation

```bash
npm install scroll-pagination-react
```

## Usage

```tsx
import { ScrollPagination } from "scroll-pagination-react";

const pagination = new ScrollPagination({
  threshold: 300,
  onLoadMore: async (page) => {
    console.log("Loading page:", page);
  },
});

pagination.start();
```

## API

| Option | Type | Description |
|---------|------|-------------|
| threshold | number | Distance from the bottom before loading |
| onLoadMore | `(page:number)=>Promise<void>` | Callback when more data should be loaded |

## Example

```tsx
const pagination = new ScrollPagination({
  threshold: 200,
  onLoadMore: async (page) => {
    const data = await fetch(`/api/posts?page=${page}`);
    console.log(data);
  },
});

pagination.start();
```

## License

MIT