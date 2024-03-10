import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // clientId: '765608611621-2onoiugq7dul7fhdtcf4hv87u1rvr3mo.apps.googleusercontent.com',
            // clientSecret: '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',
            httpOptions: {
                timeout: 100000,
            }
        })
    ],
    callbacks: {
        async session({ session }) {
            const sessionUser = await User.findOne({
                email: session.user.email
            })
    
            session.user.id = sessionUser._id.toString();
    
            return session;
        },
    
        async signIn({ profile }) {
            try {
                await connectToDB();
    
                // Check if a user already exists
                const userExists = await User.findOne({
                    email: profile.email
                });

                if (!userExists) {
                    // If not, create a new user
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(' ', '').toLowerCase(),
                        image: profile.picture
                    })
                }

                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        }
    }
})

export { handler as GET, handler as POST};