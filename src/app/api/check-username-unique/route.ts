import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
  username: usernameValidation,
});

//When user type username available or not for reducing API call
export async function GET(request: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    //Validate with zod
    const result = UserNameQuerySchema.safeParse(queryParam);
    console.log(result); // TODO remove

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: "",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVarified: true,
    });

    if (existingVerifiedUser) {
      return Response.json({
          success: false,
          message: "Username is already taken",
        },{ status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error chceking username",
      },
      {
        status: 500,
      }
    );
  }
}
