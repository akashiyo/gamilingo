import WordManager from "./wordManager";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

const SECRET = process.env.JWT_SECRET || "supersecret";

export default async function WordsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let user: any = null;

  if (token) {
    try {
      user = jwt.verify(token, SECRET); // decode verified payload
    } catch (err) {
      console.error("Invalid or expired token");
    }
  }

  if (!user) {
  if (!user) {
    redirect("/login");
  }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Words</h1>
      <WordManager />
    </div>
  );
}
