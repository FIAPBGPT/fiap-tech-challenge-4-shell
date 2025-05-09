/* eslint-disable @typescript-eslint/no-explicit-any */
/* Este arquivo contém todos os endpoints utilizados na aplicação. **
 *  Com o objetivo de manter a troca de endpoints no backend com facilidade
 */

/**
 * Represents a group of endpoints where each key is a string identifier
 * and the value is the corresponding endpoint URL as a string.
 *
 * This interface is useful for organizing and managing API endpoints
 * in a structured and type-safe manner.
 *
 * @example
 * const apiEndpoints: EndpointGroup = {
 *   getUser: "https://api.example.com/user",
 *   getPosts: "https://api.example.com/posts"
 * };
 */
interface EndpointGroup {
  [key: string]: string;
}

/**
 * Represents the structure of API endpoint groups used in the application.
 * Each property corresponds to a specific group of related endpoints.
 *
 * @property transaction - The group of endpoints related to transactions.
 * @property users - The group of endpoints related to user management.
 */
interface Endpoints {
  transaction: EndpointGroup;
  users: EndpointGroup;
}

/**
 * Defines the API endpoints for the application.
 * 
 * @property transaction - Endpoints related to transaction operations.
 * @property transaction.get - Retrieves a list of transactions for a specific user. 
 *                             Replace `:userId` with the user's ID.
 * @property transaction.getById - Retrieves a specific transaction by its ID. 
 *                                  Replace `:id` with the transaction ID.
 * @property transaction.post - Creates a new transaction.
 * @property transaction.put - Updates an existing transaction by its ID. 
 *                              Replace `:id` with the transaction ID.
 * @property transaction.delete - Deletes a transaction by its ID. 
 *                                 Replace `:id` with the transaction ID.
 * 
 * @property users - Endpoints related to user operations.
 * @property users.get - Retrieves a list of all users.
 * @property users.getById - Retrieves a specific user by their ID. 
 *                           Replace `:id` with the user's ID.
 * @property users.getByEmail - Retrieves a specific user by their email. 
 *                               Replace `:email` with the user's email.
 * @property users.post - Creates a new user.
 * @property users.put - Updates an existing user by their ID. 
 *                       Replace `:id` with the user's ID.
 * @property users.delete - Deletes a user by their ID. 
 *                          Replace `:id` with the user's ID.
 */
export const endpoints: Endpoints = {
  transaction: {
    get: "api/users/:userId/transactions",
    getById: "api/users/transactions/:id",
    post: "api/users/transactions",
    put: "api/users/transactions/:id",
    delete: "api/users/transactions/:id",
  },
  users: {
    get: "api/users",
    getById: "api/users/:id",
    getByEmail: "api/users/email/:email",
    post: "api/users",
    put: "api/users/:id",
    delete: "api/users/:id",
  },
};
