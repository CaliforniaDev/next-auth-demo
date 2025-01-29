import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the users table schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(), // Auto-incrementing primary key
  email: text('email').unique(), // Unique email field
  password: text('password'), // Password field
  createdAt: timestamp('created_at').defaultNow(), // Timestamp for when the user was created, defaults to now
  twoFactorSecret: text('2fa_secret'), // Secret for two-factor authentication
  twoFactorActivated: boolean('2fa_activated').default(false), // Boolean to check if two-factor authentication is activated, defaults to false
});
