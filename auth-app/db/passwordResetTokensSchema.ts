import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './usersSchema';

export const passwordTokens = pgTable('password_reset_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  token: text('token'),
  tokenExpiration: timestamp('token_expiration'),
});
