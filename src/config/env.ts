import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';

dotenv.config();

// Define a type for your config to be more explicit
export interface AppConfig {
  port: string | number;
  database: {
    url: string | undefined;
  };
  jwt: {
    secret: Secret;
    expiresIn: string;
  };
  session: {
    secret: string;
  };
  google: {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  };
}

// Create the config with proper type safety
export const config: AppConfig = {
  port: process.env.PORT || 5173,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  session: {
    secret: process.env.SESSION_SECRET || 'default_session_secret',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5173/api/auth/google/callback',
  }
};

// // import dotenv from 'dotenv';
// // dotenv.config();

// // export const config = {
// //   port: process.env.PORT || 5173,
// //   database: {
// //     url: process.env.DATABASE_URL,
// //   },
// //   jwt: {
// //     secret: process.env.JWT_SECRET || 'Nu0GEOjGZslCrW+bCY9LaBIFQ8TiYk9ArVLNMdUs/Ic=',
// //     expiresIn: process.env.JWT_EXPIRES_IN || '7d',
// //   },
// //   google: {
// //     clientId: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
// //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
// //     callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5173/api/auth/google/callback',
// //   }
// // };

// // import dotenv from 'dotenv';
// // dotenv.config();

// // interface Config {
// //   port: string | number;
// //   database: {
// //     url?: string;
// //   };
// //   jwt: {
// //     secret: string;
// //     expiresIn: string | number;
// //   };
// //   google: {
// //     clientId: string;
// //     clientSecret: string;
// //     callbackUrl: string;
// //   };
// // }

// // export const config: Config = {
// //   port: process.env.PORT || 5173,
// //   database: {
// //     url: process.env.DATABASE_URL,
// //   },
// //   jwt: {
// //     secret: process.env.JWT_SECRET || 'Nu0GEOjGZslCrW+bCY9LaBIFQ8TiYk9ArVLNMdUs/Ic=',
// //     expiresIn: process.env.JWT_EXPIRES_IN || '7d',
// //   },
// //   google: {
// //     clientId: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
// //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
// //     callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5173/api/auth/google/callback',
// //   },
// // };

// // import dotenv from 'dotenv';
// // import { Secret } from 'jsonwebtoken'; // Add this import
// // dotenv.config();

// // export const config = {
// //   port: process.env.PORT || 5173,
// //   database: {
// //     url: process.env.DATABASE_URL,
// //   },
// //   jwt: {
// //     secret: (process.env.JWT_SECRET || 'Nu0GEOjGZslCrW+bCY9LaBIFQ8TiYk9ArVLNMdUs/Ic=') as Secret,
// //     expiresIn: process.env.JWT_EXPIRES_IN || '7d',
// //   },
// //   google: {
// //     clientId: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
// //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
// //     callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5173/api/auth/google/callback',
// //   }
// // };

// // import dotenv from 'dotenv';
// // import { Secret } from 'jsonwebtoken';
// // dotenv.config();

// // export const config = {
// //   port: process.env.PORT || 5173,
// //   database: {
// //     url: process.env.DATABASE_URL,
// //   },
// //   jwt: {
// //     secret: (process.env.JWT_SECRET || 'Nu0GEOjGZslCrW+bCY9LaBIFQ8TiYk9ArVLNMdUs/Ic=') as Secret,
// //     expiresIn: process.env.JWT_EXPIRES_IN || '7d',
// //   },
// //   google: {
// //     clientId: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
// //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
// //     callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5173/api/auth/google/callback',
// //   }
// // };

// import dotenv from 'dotenv';
// import { Secret } from 'jsonwebtoken';
// dotenv.config();

// // Define a type for your config to be more explicit
// export interface AppConfig {
//   port: string | number;
//   database: {
//     url: string | undefined;
//   };
//   jwt: {
//     secret: Secret;
//     expiresIn: string;
//   };
//   google: {
//     clientId: string;
//     clientSecret: string;
//     callbackUrl: string;
//   };
// }

// // Create the config with proper type safety
// export const config: AppConfig = {
//   port: process.env.PORT || 5173,
//   database: {
//     url: process.env.DATABASE_URL,
//   },
//   jwt: {
//     // Cast the secret to Secret type
//     secret: process.env.JWT_SECRET || 'Nu0GEOjGZslCrW+bCY9LaBIFQ8TiYk9ArVLNMdUs/Ic=',
//     expiresIn: process.env.JWT_EXPIRES_IN || '7d',
//   },
//   google: {
//     clientId: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
//     callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5173/api/auth/google/callback',
//   }
// };

