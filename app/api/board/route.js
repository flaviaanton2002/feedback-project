import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";
import { Board } from "@/app/models/Board";
import { canWeAccessThisBoard } from "@/app/libs/boardApiFunctions";

async function getMyBoards() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return Response.json(await Board.find({ adminEmail: session.user.email }));
  } else {
    return Response.json([]);
  }
}

export async function GET(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const url = new URL(req.url);
  if (url.searchParams.get("id")) {
    const board = await Board.findById(url.searchParams.get("id"));
    return Response.json(board);
  }
  if (url.searchParams.get("slug")) {
    const board = await Board.findOne({ slug: url.searchParams.get("slug") });
    const session = await getServerSession(authOptions);
    if (!canWeAccessThisBoard(session?.user?.email, board)) {
      return new Response("Unauthorized", { status: 401 });
    }
    return Response.json(board);
  } else {
    return await getMyBoards();
  }
}

export async function POST(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(false);
  }
  const jsonBody = await req.json();
  const { name, slug, description, visibility, allowedEmails } = jsonBody;
  const boardDoc = await Board.create({
    name,
    slug,
    description,
    visibility,
    adminEmail: session.user.email,
    allowedEmails,
  });
  return Response.json(boardDoc);
}

export async function PUT(req) {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(false);
  }
  const jsonBody = await req.json();
  const { id, name, slug, description, visibility, allowedEmails } = jsonBody;
  const board = await Board.findById(id);
  if (session.user.email !== board.adminEmail) {
    return Response.json(false);
  }
  return Response.json(
    await Board.findByIdAndUpdate(id, {
      name,
      slug,
      description,
      visibility,
      allowedEmails,
    })
  );
}
