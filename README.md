# Movie Backend

Backend Node.JS app for Movie website.

## 1. Technologies

- [Nest.js](https://nestjs.com/) - a backend framework.
- [TypeScript](https://www.typescriptlang.org/) - TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- [TypeOrm](https://typeorm.io/) - an ORM.
- [PostgreSQL](https://www.postgresql.org/) - powerful, open source object-relational database system.
- [ESLint & Prettier](https://eslint.org/) - ESLint statically analyzes your code to quickly find problems.

## 2. Folder Structure

1. common - holds shared components, constants, dto, enums, types, etc.
2. migrations - holds migration files.
3. modules - holds modules, services, repositories, dto etc.
4. entities - holds typeorm entities.

## 3. Installation

### 3.1 Install dependencies

```bash
npm install
```

### 3.2 Fill in the env variables

Create copy the `.env.example` file and name it `.env`

Fill in the env variables:

- **POSTGRES\_...**: env variables for your PostgreSQL DB connection.
- **TYPEORM_SYNC**: set `true` if you want to skip migrations and sync db with your typeorm entities.
- **RUN_MIGRATIONS**: set `true` if you want to enable migrations.
- **CORS_ORIGIN**: URL to your frontend for CORS settings
- **MAX_COOKIE_AGE**: max life duration of cookies (in ms)
- **GOOGLE_CLIENT_ID**: Google client ID
- **GOOGLE_CLIENT_SECRET**: Google secret key
- **ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC**: max life duration of users authentication tokens (in ms)
- **OTP_CODE_LENGTH**: OTP code length used for 2FA
- **OTP_CODE_DURATION_SEC**: max life duration of OTP codes before they can be regenerated
- **MAIL\_...**: your mail service settings
- **STRIPE_SECRET_KEY**: Stripe secret key
- **ESIM_API_URL**: Zendit API url
- **ZENDIT_API_KEY**: Zendit API key
- **SECRET_TOKEN**: Zendit secret token

### 3.3 Run the app in development watch mode

To start the server

```bash
npm run start
```

To start the server in a watch mode for development

```bash
npm run start:dev
```

Check `http://localhost:3000/api/` if you are running locally
Check `http://localhost:3000/api/docs` for `Swagger documentation`

## 4. Migrations

Enter this command to generate a migration based on your Typeorm entities (files that end with `*.entity.ts`)

```bash
npm run migration:generate
```

Enter this command to run migrations

```bash
npm run migration:run
```

Enter this command if you need to revert migration

```bash
npm run migration:revert
```
