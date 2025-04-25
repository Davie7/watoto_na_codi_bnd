// types/express-session.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userType?: string;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
    user?: {
      email: string;
      id: string;
    };
  }
}


// import session from 'express-session';

// declare module 'express-session' {
//   interface SessionData {
//     userType?: string;
//   }
// }

// declare module 'express-serve-static-core' {
//   interface Request {
//     session: session.Session & Partial<session.SessionData>;

//     user?: {
//       email: string;
//       id: string;
//     };
//   }
// }
