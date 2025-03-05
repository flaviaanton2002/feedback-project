import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Vote } from "@/app/models/Vote";
import { Feedback } from "@/app/models/Feedback";
import { canWeAccessThisBoard } from "@/app/libs/boardApiFunctions";
import { Board } from "@/app/models/Board";
import { Notification } from "@/app/models/Notification";

async function recountVotes(feedbackId) {
  const count = await Vote.countDocuments({ feedbackId });
  await Feedback.updateOne(
    { _id: feedbackId },
    {
      votesCountCached: count,
    }
  );
}

export async function POST(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const jsonBody = await req.json();
  const { feedbackId } = jsonBody;
  const session = await getServerSession(authOptions);
  const { email: userEmail } = session.user;

  const feedback = await Feedback.findById(feedbackId);
  const board = await Board.findOne({ slug: feedback.boardName });
  if (board.archived) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!canWeAccessThisBoard(userEmail, board)) {
    return new Response("Unauthorized", { status: 401 });
  }

  // find existing vote
  const existingVote = await Vote.findOne({ feedbackId, userEmail });
  if (existingVote) {
    await Vote.findByIdAndDelete(existingVote._id);
    await recountVotes(feedbackId);
    return Response.json(existingVote);
  } else {
    const voteDoc = await Vote.create({ feedbackId, userEmail });
    await recountVotes(feedbackId);
    await Notification.create({
      type: "vote",
      sourceUserName: session?.user?.name,
      destinationUserEmail: feedback.userEmail,
      feedbackId: feedback._id,
    });
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
