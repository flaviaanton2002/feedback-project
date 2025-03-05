import { Comment } from "@/app/models/Comment";
import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Feedback } from "@/app/models/Feedback";
import { Board } from "@/app/models/Board";
import { Notification } from "@/app/models/Notification";

export async function POST(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const jsonBody = await req.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(false);
  }
  const feedback = await Feedback.findById(jsonBody.feedbackId);
  const board = await Board.findOne({ slug: feedback.boardName });
  if (board.archived) {
    return new Response("Unauthorized", { status: 401 });
  }
  const commentDoc = await Comment.create({
    text: jsonBody.text,
    uploads: jsonBody.uploads,
    userEmail: session.user.email,
    feedbackId: jsonBody.feedbackId,
  });
  await Notification.create({
    type: "comment",
    sourceUserName: session?.user?.name,
    destinationUserEmail: feedback.userEmail,
    feedbackId: feedback._id,
  });
  return Response.json(commentDoc);
}

export async function PUT(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const jsonBody = await req.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(false);
  }
  const { id, text, uploads } = jsonBody;
  const comment = await Comment.findById(id);
  const feedback = await Feedback.findById(comment.feedbackId);
  const board = await Board.findOne({ slug: feedback.boardName });
  if (board.archived) {
    return new Response("Unauthorized", { status: 401 });
  }
  const newCommentDoc = await Comment.findOneAndUpdate(
    { userEmail: session.user.email, _id: id },
    { text, uploads }
  );
  return Response.json(newCommentDoc);
}

export async function GET(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const url = new URL(req.url);
  if (url.searchParams.get("feedbackId")) {
    const result = await Comment.find({
      feedbackId: url.searchParams.get("feedbackId"),
    }).populate("user");
    return Response.json(result);
  }
  return Response.json(false);
}
