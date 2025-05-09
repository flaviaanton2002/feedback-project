import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Subscription } from "@/app/models/Subscription";
import mongoose from "mongoose";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const userSession = await getServerSession(authOptions);
  if (!userSession) {
    return new Response("Unauthorized", { status: 401 });
  }
  return Response.json(
    await Subscription.findOne({ userEmail: userSession.user.email })
  );
}

export async function POST(req) {
  const priceId = "price_1QzbT7GdiHDc6Snk2hIc7Sah";
  const userSession = await getServerSession(authOptions);
  if (!userSession) {
    return new Response("Unauthorized", { status: 401 });
  }
  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: process.env.NEXTAUTH_URL + "/subscription?success=1",
    cancel_url: process.env.NEXTAUTH_URL + "/subscription?cancel=1",
    metadata: { userEmail: userSession?.user?.email },
    subscription_data: { metadata: { userEmail: userSession?.user?.email } },
  });

  return Response.json(stripeSession.url);
}
