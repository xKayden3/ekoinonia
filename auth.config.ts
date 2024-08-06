import { AuthError, NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import prisma from './lib/prisma';
import { compare } from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';

class customError extends AuthError {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

const authConfig = {
  session: {
    strategy: 'jwt'
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialProvider({
      name: 'Sign in',
      id: 'credentials',
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: String(credentials.email)
          }
        });

        if (
          !user ||
          !(await compare(String(credentials.password), user.password!))
        ) {
          // throw new customError(
          //   'This account is not locked. Please contact your administrator.'
          // );
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          randomKey: 'Hey cool'
        };

        // const user = {
        //   id: '1',
        //   name: 'John',
        //   email: credentials?.email as string
        // };

        // if (user) {
        //   // Any object returned will be saved in `user` property of the JWT
        //   return user;
        // } else {
        //   // If you return null then an error will be displayed advising the user to check their details.
        //   return null;

        //   // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        // }
      }
    })
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const paths = ['/dashboard'];
      const isProtected = paths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );
      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL('/api/auth/signin', nextUrl.origin);
        redirectUrl.searchParams.append('callbackUrl', nextUrl.href);
        return Response.redirect(redirectUrl);
      }
      return true;
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey
        };
      }
      return token;
    },
    session(params) {
      return {
        ...params.session,
        user: {
          ...params.session.user,
          id: params.token.id as string,
          randomKey: params.token.randomKey
        }
      };
    }
  },
  pages: {
    signIn: '/' //sigin page
  }
} satisfies NextAuthConfig;

export default authConfig;
