import userModel from "../models/userModel.js";
import messageModel from "../models/messageModel.js";
import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId, io } from "../config/socket.js";

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await userModel
      .find({ _id: { $ne: loggedInUser } })
      .select("-password");
    return res.status(200).json(filteredUsers);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await messageModel.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    return res.status(200).json(messages);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.status(201).json(newMessage);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export { getUsersForSidebar, getMessages, sendMessage };
