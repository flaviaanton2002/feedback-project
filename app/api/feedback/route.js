import { Feedback } from "@/app/models/Feedback";
import mongoose from "mongoose";

export async function POST(req) {
  const jsonBody = await req.json();
  const { title, description } = jsonBody;
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  await Feedback.create({ title, description });
  return Response.json(jsonBody);
}
