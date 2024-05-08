import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await connectDB();

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if(!user) {
        return Response.json(
            {
              success: false,
              message: "User not found",
            },
            { status: 404 }
          );
    }
    //is user accepting the message 
    if(!user.isAcceptingMessage) {
        return Response.json(
            {
              success: false,
              message: "User is not accepting the messages",
            },
            { status: 403 }
          );
    }

    const newMessage = { content, createdAt: new Date()}
    user.messages.push(newMessage as Message)
    await user.save()

    return Response.json(
        {
          success: true,
          message: "Message sent succesfully",
        },
        { status: 403 }
      );
  } catch (error) {
    console.error("An unexpected error occured", error);
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept message",
      },
      { status: 500 }
    );
  }
}
