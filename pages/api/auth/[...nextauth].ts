import NextAuth from "next-auth";
import axios from 'axios';
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = 'https://sukien.doppelherz.vn/api/login';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                phone: { label: "Phone", type: "text", placeholder: "Phone", value: '' },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials, req) => {
                const payload = {
                    phone: credentials?.phone,
                    password: credentials?.password,
                };
                const user = await (await axios.post(API_URL, payload)).data;
                if (user.status_code === 200) return {
                    access_token: user.access_token,
                    status_code: user.status_code,
                    token_type: user.token_type
                };
                else return {
                    status_code: user.status_code,
                    error: user.error
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_ID,
            clientSecret: process.env.TWITTER_SECRET,
        }),
    ],
    secret: process.env.SECRET,

    session: {
        strategy: 'jwt',
        maxAge: 20,
    },
    jwt: {
        secret: process.env.SECRET,
    },
    pages: {
        signIn: '/dangnhap',
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.data = user
            }
            return token
        },
        session: async ({ session, token }) => {
            if (token.data) {
                session.user = token.data
            }
            return session
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    },
    events: {},
    debug: true,
})
