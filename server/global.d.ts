// Project-level shims so ts-node and TypeScript can compile scripts outside src/
declare module 'bcrypt'
declare module 'jsonwebtoken'
declare module 'dotenv'

// Keep this file until you add proper @types packages for these modules.
