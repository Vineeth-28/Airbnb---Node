<div align="center">

# Notification Service

**A TypeScript backend for asynchronous, template-based email delivery.**

[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js&logoColor=white)](#getting-started)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](#technology-stack)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](#technology-stack)
[![License](https://img.shields.io/badge/License-ISC-blue)](#license)

</div>

## About

Notification Service is a backend for preparing and delivering application emails. Instead of having application code build and send every email inline, this project provides a queue-and-worker pipeline: notification data is placed on a **BullMQ** queue backed by **Redis**, a worker renders an HTML template with **Handlebars**, and **Nodemailer** sends the result through Gmail SMTP.

This separation is useful for common product notifications such as welcome emails, booking confirmations, receipts, and account alerts. These are examples of how the service could be used; the current repository includes a reusable welcome template and does not implement all of these message types as ready-to-use features.

The project also provides an Express API for basic service checks, a Basic Authentication-protected Bull Board dashboard for inspecting the mail queue, request correlation IDs, and structured logging.

> **API status:** The email queue producer and worker are implemented for application use. There is not currently an HTTP endpoint for submitting email notifications. The HTTP API currently exposes ping and health-check routes.

## What the Project Does

The project brings together the main steps involved in sending a templated email:

- **Accepts notification data in application code.** The notification payload identifies the recipient, subject, template, and template parameters.
- **Queues the work.** The producer adds a job to Redis through BullMQ, separating queueing from the actual SMTP send operation.
- **Builds the email content.** The worker selects a Handlebars template and fills its placeholders using the job's parameters.
- **Sends the message.** Nodemailer connects to Gmail SMTP and sends the rendered HTML to the recipient.
- **Makes operations visible.** Bull Board shows mail-queue job state, while Winston records service and worker activity.
- **Supports service checks.** The versioned Express API includes a health route and a request-validation example.

This repository is a foundation for integrating email notifications into a larger application. An integrating application can call the queue producer in code; a public HTTP endpoint for external clients to submit notifications has not yet been added.

## Highlights

- Queue email work with BullMQ and Redis for asynchronous processing.
- Render reusable Handlebars email templates with per-message parameters.
- Send rendered HTML email through Gmail SMTP.
- Inspect the mailer queue with a protected Bull Board dashboard.
- Organize Express routes under versioned API prefixes.
- Attach correlation IDs to incoming requests for log tracing.
- Write Winston logs to the console, daily rotating files, and MongoDB.
- Validate the ping request body using Zod.

## Email Processing Flow

1. An integrating application calls the email producer with the recipient, subject, template ID, and template parameters.
2. The producer adds the payload as a job to the `queue-mailer` BullMQ queue in Redis.
3. The worker consumes the job and loads the matching Handlebars template.
4. Handlebars replaces template placeholders with values from the job parameters.
5. Nodemailer sends the generated HTML email using the configured Gmail SMTP account.
6. The worker logs success or failure; queue job states can be inspected in Bull Board.

Queueing separates the caller's work from the SMTP send step, and gives the service a place to inspect queued and processed jobs. Jobs currently use BullMQ's default options: retry/backoff behavior and retention policies have not been configured by this project.

## Current Scope

| Included in this repository | Not implemented yet |
| --- | --- |
| BullMQ producer and email worker | Public REST endpoint for submitting email notifications |
| Handlebars renderer and a welcome email template | User/account management or a database of notification recipients |
| Gmail SMTP email delivery | Multiple provider adapters or provider failover |
| Bull Board dashboard for the mailer queue | Custom queue retry, backoff, or job-retention policies |
| Health check and ping API routes | Automated test suite |

## Technology Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js |
| Language | TypeScript |
| Web framework | Express 5 |
| Background jobs | BullMQ |
| Queue backend | Redis |
| Email delivery | Nodemailer, Gmail SMTP |
| Email templates | Handlebars |
| Queue dashboard | Bull Board |
| Logging | Winston, `winston-daily-rotate-file`, `winston-mongodb` |
| Request validation | Zod |

## Getting Started

### Prerequisites

- Node.js and npm (the current Node.js LTS release is recommended)
- Redis, running locally or reachable from the service
- Gmail SMTP credentials to send email
- MongoDB reachable at the configured log database URI; if `MONGODB_URI` is unset, the logger uses `mongodb://localhost:27017/mydatabase`

### Install dependencies

```bash
npm install
```

### Configure the environment

Create a `.env` file in the project root:

```env
PORT=3002
REDIS_HOST=localhost
REDIS_PORT=6379
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-gmail-app-password
BULL_BOARD_USERNAME=admin
BULL_BOARD_PASSWORD=replace-with-a-strong-password
MONGODB_URI=mongodb://localhost:27017/mydatabase
```

When using Gmail, `MAIL_PASS` should be an app password. Protect your credentials: do not commit `.env` or paste real secrets into issues or documentation.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3002` | Port used by the Express server. |
| `REDIS_HOST` | `localhost` | Redis hostname for BullMQ. |
| `REDIS_PORT` | `6379` | Redis port for BullMQ. |
| `MAIL_USER` | Empty | Gmail SMTP account and sender address. |
| `MAIL_PASS` | Empty | Gmail SMTP password or app password. |
| `BULL_BOARD_USERNAME` | Unset | Username required to access the queue dashboard. |
| `BULL_BOARD_PASSWORD` | Unset | Password required to access the queue dashboard. |
| `MONGODB_URI` | `mongodb://localhost:27017/mydatabase` | MongoDB connection string for Winston logs. |

### Run in development

Start Redis and MongoDB, then start the server:

```bash
npm run dev
```

The server listens on `http://localhost:3002` by default. Set `PORT` in `.env` to use another port.

### Build and run

```bash
npm run build
npm start
```

The TypeScript compiler writes JavaScript to `dist/`. Email templates are source assets in `src/templates/mailer/`; the current TypeScript build does not copy these files, so make sure they are available at `dist/templates/mailer/` when running the compiled server.

## API Reference

The Express server mounts the versioned routers under `/api/v1` and `/api/v2`. The v2 router is currently empty.

### `GET /api/v1/ping/health`

Simple liveness check. Responds with HTTP `200` and the text `OK`.

```bash
curl http://localhost:3002/api/v1/ping/health
```

### `GET /api/v1/ping`

Validates a JSON request body containing a non-empty `message`, then responds with the submitted value.

```bash
curl -X GET http://localhost:3002/api/v1/ping \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello\"}"
```

Successful response:

```json
{
  "message": "Pong",
  "receivedData": "Hello",
  "success": true
}
```

Invalid request bodies receive HTTP `400`. This route currently uses `GET` with a JSON body; an HTTP notification submission route is not implemented yet.

### Queue dashboard

Open `http://localhost:3002/admin/queues` and sign in with `BULL_BOARD_USERNAME` and `BULL_BOARD_PASSWORD` to inspect the mailer queue. `/admin/queue` redirects to `/admin/queues`. If either credential is missing, the dashboard responds with HTTP `503`; requests without valid credentials receive HTTP `401`.

Use HTTPS if exposing the dashboard outside a trusted local environment.

## Notification Payload

The queue producer accepts a payload with this TypeScript shape:

```ts
type NotificationDTO = {
  to: string;
  subject: string;
  templateId: string;
  params: Record<string, any>;
};
```

`templateId` selects a `.hbs` file from `src/templates/mailer/` without including the file extension. The `params` object provides the values used to populate the selected Handlebars template.

> Jobs are currently added with BullMQ's default options. Configure retries, backoff, and job retention explicitly before relying on them for production delivery guarantees.

## Project Structure

```text
src/
├── config/          # Environment, Redis, SMTP, and Winston configuration
├── controllers/     # HTTP request handlers
├── dtos/            # Notification payload types
├── middlewares/     # Queue-dashboard authentication, correlation IDs, errors
├── processor/       # BullMQ email worker
├── producers/       # Email queue producer
├── queues/          # BullMQ queue setup
├── routes/          # Versioned Express routers
├── service/         # Email delivery service
├── templates/       # Handlebars renderer and email templates
├── validators/      # Zod schemas and request validation
└── server.ts        # Application entry point
```

## Logging

Winston sends logs to the console, daily rotating files under `logs/`, and a MongoDB `logs` collection. The file transport is configured to keep up to 14 days of logs and limit individual files to 20 MB. Incoming HTTP requests receive correlation IDs to help trace request-related log entries.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run the development server with TypeScript watch mode. |
| `npm run build` | Compile TypeScript into `dist/`. |
| `npm start` | Run the compiled server. |
| `npm run format` | Format TypeScript source files with Prettier. |
| `npm run format:check` | Check TypeScript formatting. |
| `npm test` | Tests are not configured yet. |

## License

ISC. See the `license` field in `package.json`.
