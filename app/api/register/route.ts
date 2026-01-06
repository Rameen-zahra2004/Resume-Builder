import { NextResponse } from "next/server";
import { users } from "@/app/lib/mock-db";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password, // plain text (testing only)
    };

    users.push(newUser);

    return NextResponse.json(
      { message: "User registered successfully", user: { id: newUser.id, name, email } },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
