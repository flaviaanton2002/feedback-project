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
    const sortParam = url.searchParams.get("sort");
    let sortDef;
    if (sortParam === "votes") {
      sortDef = { votesCountCached: -1 };
    }
    if (sortParam === "latest") {
      sortDef = { createdAt: -1 };
    }
    if (sortParam === "oldest") {
      sortDef = { createdAt: 1 };
    }
    return Response.json(
      await Feedback.find(null, null, { sort: sortDef }).populate("user")
    );
  }
}
