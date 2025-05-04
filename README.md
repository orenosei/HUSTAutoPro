# HUST AutoPro

This project is a web application that leverages modern tools like Vite, TailwindCSS, and Drizzle ORM. Follow the instructions below to set up and run the project locally.

## Prerequisites

Make sure your development environment meets the following requirements:

* **Node.js** (v18 or later)
* **npm** (v9 or later)
* **Git**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hustautopro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

The development server will start, and the application will be accessible at `http://localhost:5173/` by default.

### 4. Build the Project

To create a production build, run:

```bash
npm run build
```

The build output will be available in the `dist` directory.

### 5. Preview the Build

To preview the production build locally:

```bash
npm run preview
```

### 6. Database Setup (Drizzle ORM)

#### Push the Schema

Ensure you have your database configured in the `./drizzle/drizzle.config.js` file. Then, push the schema to the database:

```bash
npm run db:push
```

#### Open Drizzle Studio

Use Drizzle Studio for database management:

```bash
npm run db:studio
```

### 7. Linting

To lint the project:

```bash
npm run lint
```

## Project Dependencies

### Core Dependencies

* **React**: v19.1.0
* **Vite**: v6.3.1
* **TailwindCSS**: v4.1.4
* **Drizzle ORM**: v0.43.1

### Dev Dependencies

* **ESLint**: v9.22.0
* **Drizzle Kit**: v0.31.1
* **PostCSS**: v8.5.3

## Notes

* Make sure to set up environment variables as required by your database and other services.
* TailwindCSS is integrated using the `@tailwindcss/vite` plugin.
* Check `package.json` for all available scripts and dependencies.

## Contribution

Feel free to fork the repository, create a new branch, and submit a pull request for any feature additions or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
