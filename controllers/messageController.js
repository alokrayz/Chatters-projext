import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";

export const sendMessage = async(req, res) => {
    try {
        const {message} = req.body;
        const {id:reciverId} = req.params;
        const senderId = req.user._id;

        let chats = await Conversation.findOne({
            participants: { $all: [senderId, reciverId] }
        })
        if(!chats){
            chats = await Conversation.create({
                participants: [senderId, reciverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            reciverId,
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