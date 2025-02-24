import { Feedback } from "@/app/models/Feedback";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const jsonBody = await req.json();
  const { title, description, uploads } = jsonBody;
  const session = await getServerSession(authOptions);
  const userEmail = session.user.email;
  const feedbackDoc = await Feedback.create({
    title,
    description,
    uploads,
    userEmail,
  });
  return Response.json(feedbackDoc);
}

export async function PUT(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const jsonBody = await req.json();
  const { title, description, uploads, id } = jsonBody;
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(false);
  }
  const newFeedbackDoc = await Feedback.updateOne(
    { _id: id, userEmail: session.user.email },
    {
      title,
      description,
      uploads,
    }
  );
  return Response.json(newFeedbackDoc);
}

export async function GET(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const url = new URL(req.url);
  if (url.searchParams.get("id")) {
    return Response.json(await Feedback.findById(url.searchParams.get("id")));
  } else {
    return Response.json(await Feedback.find().populate("user"));
  }
}
