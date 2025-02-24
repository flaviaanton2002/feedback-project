import { Comment } from "@/app/models/Comment";
import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const jsonBody = await req.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(false);
  }
  const commentDoc = await Comment.create({
    text: jsonBody.text,
    uploads: jsonBody.uploads,
    userEmail: session.user.email,
    feedbackId: jsonBody.feedbackId,
  });
  return Response.json(commentDoc);
}

export async function GET(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const url = new URL(req.url);
  if (url.searchParams.get("feedbackId")) {
    const result = await Comment.find({
      feedbackId: url.searchParams.get("feedbackId"),
    }).populate("user");
    return Response.json(
      result.map((doc) => {
        const { userEmail, ...commentWithoutEmail } = doc.toJSON();
        const { email, ...userWithoutEmail } = commentWithoutEmail.user;
        commentWithoutEmail.user = userWithoutEmail;
        return commentWithoutEmail;
      })
    );
  }
  return Response.json(false);
}
