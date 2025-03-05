import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Notification } from "@/app/models/Notification";
import mongoose from "mongoose";

export async function GET() {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  return Response.json(
    await Notification.find(
      { destinationUserEmail: session.user.email },
      null,
      { sort: { createdAt: -1 } }
    ).populate("feedbackId")
  );
}

export async function PUT(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id } = await req.json();
  await Notification.findByIdAndUpdate(id, { read: true });
  return Response.json(true);
}
