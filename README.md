# NextAuth Demo

This repository serves as a practice project for implementing **NextAuth.js**, a flexible and easy-to-integrate authentication library for Next.js applications. The project follows along with a course to demonstrate best practices and practical use cases for setting up authentication in modern web applications. ✨

## Key Features

- **Email and Password Authentication**
- **OAuth Integration** (e.g., Google, GitHub)
- **Two-Factor Authentication (2FA)**
- **Session Management**
- **Database Integration** (e.g., PostgreSQL with Drizzle ORM)
- **Password Reset Functionality**
- **Secure Route Protection**

## Tech Stack

- **Next.js**: Framework for building server-rendered React applications.
- **NextAuth.js**: Authentication library for Next.js.
- **PostgreSQL**: Relational database for storing user data.
- **Drizzle ORM**: Simplified ORM for interacting with the database.
- **TypeScript**: Strongly typed language for enhanced developer experience.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **shadcn/ui**: Component library for building modern UIs.
- **React Hook Form & Zod**: Tools for efficient form handling and validation.
- **Resend**: For reliable email communication. 📚

## Getting Started

### Prerequisites 🛠️

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or newer)
- [PostgreSQL](https://www.postgresql.org/)
- A GitHub or Google developer account for OAuth setup (optional)

### Installation 🚀

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/next-auth-demo.git
   cd next-auth-demo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Installation of npm Packages 📦

To install the required npm packages, run the following command:

```bash
npm install next-auth @next-auth/prisma-adapter drizzle-orm tailwindcss shadcn/ui react-hook-form zod
```

3. Create a `.env.local` file in the root directory and add the following:

   ```env
   DATABASE_URL=your_postgresql_connection_string
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

### Project Structure 🗂️

- `pages/`: Contains Next.js pages, including API routes for authentication.
- `components/`: Reusable UI components like login forms.
- `lib/`: Utility functions and configuration files.
- `db/`: Database models and migration files (e.g., Drizzle ORM setup).

## Learning Goals 🎓

- Understand how to configure and use NextAuth.js.
- Learn to implement various authentication providers.
- Explore secure session handling.
- Integrate PostgreSQL with Next.js using Drizzle ORM.
- Gain hands-on experience with TypeScript in authentication workflows.
- Implement Two-Factor Authentication (2FA) for enhanced security.
- Create password reset functionality and protect sensitive routes.

## Resources 🔗

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## License ✅

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contributions 💡

Contributions are welcome! Feel free to fork this repository, submit issues, or create pull requests.

---

Enroll in the course and take the next step in your development journey. By the end of this course, you'll be fully equipped to build and deploy secure, scalable authentication systems with Next.js and NextAuth v5! 🎉🌐

