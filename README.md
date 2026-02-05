# Pastebin-Lite

[cite_start]A small "Pastebin"-like application built with Next.js and Redis[cite: 1, 2, 5].

## Local Setup
1. [cite_start]Clone the repository[cite: 136].
2. [cite_start]Install dependencies: `npm install`[cite: 145].
3. Create a `.env.local` file and add your Upstash Redis credentials.
4. [cite_start]Run the development server: `npm run dev`[cite: 145].
5. [cite_start]Set `TEST_MODE=1` in your environment to enable deterministic time testing[cite: 79].

## Persistence Layer
[cite_start]This project uses **Redis** (specifically Upstash Redis) as the persistence layer[cite: 11, 86, 137]. [cite_start]Redis was chosen because it allows the data to survive across serverless requests and provides native TTL (Time-To-Live) support[cite: 85, 86].

## Design Decisions
- [cite_start]**Validation**: Used Zod to ensure all API inputs meet the required constraints (content, ttl, max_views)[cite: 43, 44, 45, 46, 111].
- [cite_start]**Time Testing**: The application supports the `x-test-now-ms` header when `TEST_MODE=1` is set to handle deterministic expiry logic[cite: 78, 79, 80, 81].
- [cite_start]**Safety**: Paste content is rendered safely to prevent script execution[cite: 76].