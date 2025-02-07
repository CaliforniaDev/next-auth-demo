'use server';

interface UpdatePasswordFormData {
  token: string;
  password: string;
  passwordConfirm: string;
}
// Function to update the user's password
export const updatePassword = async ({
  token,
  password,
  passwordConfirm,
}: UpdatePasswordFormData) => {
  return {
    error: true,
    message: 'An error occurred.',
  }
};
