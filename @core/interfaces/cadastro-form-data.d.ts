/**
 * Represents the data structure for a user registration form.
 *
 * @interface CadastroFormData
 * @property {string} name - The full name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password chosen by the user.
 * @property {string} [confirmPassword] - An optional field for confirming the password.
 */
export interface CadastroFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string; // Optional field for password confirmation
}
