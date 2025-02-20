import { Feedback } from "@/app/models/Feedback";
import mongoose from "mongoose";

export async function POST(req) {
  const jsonBody = await req.json();
  const { title, description, uploads } = jsonBody;
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  await Feedback.create({ title, description, uploads });
  return Response.json(jsonBody);
}

export async function GET() {
  const mongoUrl = process.env.MONGO_URL;
  mongoose.connect(mongoUrl);
  return Response.json(await Feedback.find());
}
