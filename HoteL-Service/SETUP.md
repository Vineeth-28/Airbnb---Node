# 🛠 Setup Guide — Express-Typescript-Template

A step-by-step walkthrough to get this project running locally.

---

## 1. Prerequisites

Make sure you have these installed before starting:

| Tool | Minimum Version | Check with |
|---|---|---|
| Node.js | 18.x (LTS recommended) | `node -v` |
| npm | comes with Node | `npm -v` |
| MongoDB | any recent version, local or Atlas | `mongod --version` |
| Git | any recent version | `git --version` |

---

## 2. Clone the Repository

```bash
git clone https://github.com/Vineeth-28/Express-Typescript-Template.git
cd Express-Typescript-Template
```

---

## 3. Install Dependencies

```bash
npm install
```

This installs both runtime dependencies (`express`, `dotenv`, `winston`, `winston-mongodb`, `winston-daily-rotate-file`, `uuid`) and dev dependencies (`typescript`, `nodemon`, `ts-node`, `tsx`, `zod`, `prettier`, type definitions).

---

## 4. Configure Environment Variables

Copy the example env file and fill in your own values:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mydatabase
```

| Variable | Required | Notes |
|---|---|---|
| `PORT` | Yes | Any free port. `3000` is the default. |
| `MONGODB_URI` | Yes | Points to a local MongoDB instance or an Atlas cluster. Used for the app's DB connection and/or the Winston Mongo log transport. |

> Never commit your real `.env` file — it's already covered by `.gitignore`.

---

## 5. Make Sure MongoDB Is Running

**Local MongoDB:**

```bash
mongod
```

(Leave this running in its own terminal, or run it as a background service.)

**Or use MongoDB Atlas:**
Replace `MONGODB_URI` in `.env` with your Atlas connection string, e.g.:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/mydatabase
```

---

## 6. Run the Dev Server

```bash
npm run dev
```

This runs `nodemon src/server.ts` — the server restarts automatically whenever you save a file. You should see logs confirming:
- The Express server is listening on your configured `PORT`
- A successful MongoDB connection

Visit `http://localhost:3000` (or your configured port) to confirm it's up.

---

## 7. Formatting Your Code

Before committing, format your code with Prettier:

```bash
npm run format          # auto-fixes formatting
npm run format:check    # checks without modifying files (useful in CI)
```

---

## 8. Building for Production

```bash
npm run build
```

This compiles TypeScript from `src/` into plain JavaScript in `dist/` using `tsc`.

### ⚠️ Fix before running `npm start`

`package.json` currently has a typo in the `start` script:

```json
"start": "node dist/server,js"
```

Change the comma to a period:

```json
"start": "node dist/server.js"
```

Then run:

```bash
npm start
```

---

## 9. Verifying Logs

Once the server is running and handling requests, check that logging is working:

- **File logs:** look in the `logs/` directory for daily-rotated log files.
- **MongoDB logs:** connect to your `MONGODB_URI` database and check the logs collection created by `winston-mongodb`.
- **Request tracing:** each request should have a UUID attached — grep or query for that ID to trace a single request across all its log lines.

---

## 10. Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| `MongooseServerSelectionError` / connection refused | MongoDB isn't running, or `MONGODB_URI` is wrong | Start `mongod`, or double-check the Atlas connection string |
| `npm start` fails with "Cannot find module" | You ran `npm start` without building first | Run `npm run build` before `npm start` |
| `npm start` fails immediately with a file-not-found error | The `dist/server,js` typo in `package.json` | Fix the script as shown in Step 8 |
| Port already in use | Another process is using the configured `PORT` | Change `PORT` in `.env`, or stop the other process |
| TypeScript errors on build | Type mismatch or missing `@types/*` package | Run `npm install` again, check `tsconfig.json` settings |
| Validation errors not returning expected messages | Zod schema doesn't match the request shape | Double-check the schema against the actual payload |

---

## 11. Next Steps

Once running, you can start building on top of the template:
- Add new versioned routes under `src/routes/`
- Define new Zod schemas for request validation
- Add controllers/services for your actual business logic
- Extend the error handler for custom error types as needed

---

Need the full feature overview instead of setup steps? See [README.md](./README.md).
