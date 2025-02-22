import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Vote } from "@/app/models/Vote";

export async function POST(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const jsonBody = await req.json();
  const { feedbackId } = jsonBody;
  const session = await getServerSession(authOptions);
  const { email: userEmail } = session.user;

  // find existing vote
  const existingVote = await Vote.findOne({ feedbackId, userEmail });
  if (existingVote) {
    await Vote.findByIdAndDelete(existingVote._id);
    return Response.json(existingVote);
  } else {
    const voteDoc = await Vote.create({ feedbackId, userEmail });
    return Response.json(voteDoc);
  }
}

export async function GET(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const url = new URL(req.url);
  if (url.searchParams.get("feedbackIds")) {
    const feedbackIds = url.searchParams.get("feedbackIds").split(",");
    const votesDocs = await Vote.find({ feedbackId: feedbackIds });
    return Response.json(votesDocs);
  }
  return Response.json([]);
}
