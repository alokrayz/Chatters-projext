import mongoose from "mongoose";
import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";

export const sendMessage = async(req, res) => {
    try {
        const {message} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let chats = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })
        if(!chats){
            chats = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
            conversationId: chats._id
        }); 

        if(newMessage){
            chats.messages.push(newMessage._id);
        }

        await Promise.all([chats.save(), newMessage.save()]);


        //socket.io function
        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message
        });
    }
}

export const getMessages = async(req, res) => {
    try {
         const { id } = req.params;
        const receiverId = new mongoose.Types.ObjectId(id);
        const senderId = req.user._id;
        // console.log("Sender ID:", senderId);
        // console.log("Receiver ID:", receiverId);

        const chats = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        if(!chats){
            return res.status(404).json({
                success: false,
                message: "No conversation found"
            });
        }

        const message = chats.messages;

        res.status(200).json({
            success: true,
            message: "Messages retrieved successfully",
            data: message
        });
    } catch (error) {
        
    }
}