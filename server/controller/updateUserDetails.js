const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")
const UserModel = require("../models/UserModel")

async function updateUserDetails(request,response){
    try {
      const token = request.cookies.token || "";

      const user = await getUserDetailsFromToken(token);

      const { name, profile_pic } = request.body;

     const updatedUser = await UserModel.findByIdAndUpdate(
       user._id,
       { name, profile_pic },
       { new: true }, // 👉 IMPORTANT
     );

    console.log("updatedUser", updatedUser);

      return response.json({
        message: "user update successfully",
        data: updatedUser,
        success: true,
      });
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = updateUserDetails
