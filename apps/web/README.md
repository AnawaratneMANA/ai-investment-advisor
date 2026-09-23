# Web

Next.js frontend foundation using React, TypeScript, Tailwind CSS, and shadcn-compatible UI
utilities.

This project targets Node.js 22, as recorded in `.nvmrc` and used by the frontend Docker image.

Run locally from this directory after installing dependencies:

```bash
npm install
npm run dev
```

The foundation includes a responsive application shell, desktop/mobile navigation, base design
tokens, a reusable button component, and `lib/api.ts` for the backend URL configured by
`NEXT_PUBLIC_API_URL`. Product pages and authentication will be added in later tasks.
