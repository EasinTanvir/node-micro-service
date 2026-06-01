import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("jwt")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);
    console.log({ decode });
  } catch {
    console.log("failed to login");
    // redirect("/login");
  }

  return <div>Protected Post Page</div>;
}
