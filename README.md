# HUST AutoPro

HUST AutoPro is a comprehensive automotive marketplace and community platform built with modern web technologies including Vite, React, TailwindCSS, and Drizzle ORM. The application provides an intuitive interface for automotive enthusiasts and vehicle buyers/sellers.

## Key Features

### Vehicle Marketplace
- **Post a Vehicle for Sale**: Users can upload details (e.g., make, model, year, mileage, and condition) with multiple high-quality images.
- **Edit/Delete Listings**: Allow users to update or remove their vehicle listings.
- **Price Recommendations**: AI-powered suggestions based on market data.
- **Advanced Search and Filtering**: Buyers can find their ideal vehicle using filters like price range, location, make, and model.

### User Interaction with Vehicles
- **Favorite Vehicles**: Users can "like" or "favorite" vehicles for quick access later.
- **Schedule Viewings**: Buyers can request a meeting with sellers via an integrated scheduling feature, enabling seamless coordination.

### Automotive Blog Platform
- **Publish Articles**: Community members can share automotive articles, reviews, maintenance tips, and industry news.
- **Like Blog Posts**: Readers can "like" articles or reviews they find helpful.
- **Commenting System**: Members can leave comments on blog posts, enabling discussions or feedback.
- **Share Blogs**: Share blog posts on social media platforms directly.

### AI-Powered Assistant
- **Vehicle Matching**: AryaChat bot suggests vehicles based on user preferences.
- **Technical Queries**: Assist with maintenance questions or provide repair guidance.
- **Negotiation Tips**: Guide buyers and sellers with market insights to facilitate fair negotiations.

### Administrative Dashboard
- **Approve/Reject Listings & Posts**: Admins can manage content quality by moderating vehicle listings and blog posts.
- **Ban/Flag Users**: System for banning or flagging users who violate community guidelines.
- **Analytics Dashboard**: Insightful charts showing trends like popular vehicle types, active users, and article engagement rates.

### Notification & Personalization
- **Real-time Notifications**: Notify users about comments, likes, or meeting requests.
- **Saved Searches**: Users can save search queries and receive alerts when new vehicles match their criteria.



## Prerequisites

Make sure your development environment meets the following requirements:

* **Node.js** (v20 or later)
* **npm** (v10 or later)
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
