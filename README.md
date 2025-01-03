## Solace

This code demonstrates how to implement server-side sorting and filtering for big data using AG-Grid. The assignment provider utilized a small subset of data for client-side handling. However, the description noted it could have 100k+ rows of data in production. I chose this approach due to having worked with financial data, where client-side data processing would be highly impractical. Using my approach, all that is needed is db indexing and creating separate views per client based on the last call. This would result in retrieving the proper subset of results even after sorting and filtering large datasets.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install dependencies

```bash
npm i
```

## Database set up

Use an `.env.local` to configure the DATABASE_URL variable

```bash
docker compose up -d
```

2. Create a `solaceassignment` database if not present.

3. Push migration to the database

```bash
npx drizzle-kit push
```

4. Seed the database

Configure how many rows of data you wish to generate in `api/seed/route.ts`
This will call `generateAdvocates` in `db/seed/advocates.ts`. 
You can modify the endpoint to take in the row count as a param but I left it as is since it's a test setup.

```bash
curl -X POST http://localhost:3000/api/seed
```

5. Run the development server:

```bash
npm run dev
```
![image](https://github.com/user-attachments/assets/3edcbaeb-3326-4b15-815c-56f463875c9a)
