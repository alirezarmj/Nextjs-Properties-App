import connectDB from "@/config/database";
import Property from "@/models/Property";

//GET api/properties/user/:userId
export const GET = async (req, { params }) => {
  try {
    await connectDB();
    const userId = params.userId;
    if (!userId) {
      return new Response(JSON.stringify("User id is required"), {
        status: 400,
      });
    }
    const properties = await Property.find({ owner: userId });
    return new Response(JSON.stringify(properties), {
      status: 200,
    });
    // res.status(200).json(properties);
  } catch (error) {
    return new Response(JSON.stringify({ message: "Something went wrong!" }), {
      status: 500,
    });
  }
};
