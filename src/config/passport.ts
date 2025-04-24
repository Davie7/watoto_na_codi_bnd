import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import { config } from './env';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              { googleId: profile.id },
              { email: profile.emails?.[0].value }
            ]
          },
        });

        if (existingUser) {
          // Update Google ID if not set
          if (!existingUser.googleId) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { googleId: profile.id },
            });
          }
          return done(null, existingUser);
        }

        // Create new user with temporary userType (will be updated during registration flow)
        const newUser = await prisma.user.create({
          data: {
            email: profile.emails?.[0].value || '',
            googleId: profile.id,
            userType: 'STUDENT', // Default, will be updated later
          },
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;



