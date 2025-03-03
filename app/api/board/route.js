import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";
import { Board } from "@/app/models/Board";

export async function GET() {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return Response.json(await Board.find({ adminEmail: session.user.email }));
  } else {
    return Response.json([]);
  }
}
