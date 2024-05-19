declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in using session caching.
     * @param email The email to log in with.
     * @param password The password to log in with.
     */
    setSession(): Chainable<void>;
  }
}
