import Conversation from "../Models/conversationModels.js";
import User from "../Models/userModels.js";

export const getUserBySearch = async(req, res) => {
    try {
        const search = req.query.search || '';
        const currentUserID = req.user._id;
       const user = await User.find({
        $and:[
            {
                $or:[
                    {username:{$regex:'.*'+search+'.*',$options:'i'}},
                    {fullname:{$regex:'.*'+search+'.*',$options:'i'}}
                ]
            },{
                _id:{$ne:currentUserID}
            }
        ]
    }).select("-password").select("email")

    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: user
    })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message
        })
    }
}

export const getcurrentChatters = async(req, res) => {
    try {
        const currentUserID = req.user._id;
        const currentChatters = await Conversation.find({
            participants: currentUserID
        }).sort({ 
            updatedAt: -1 
        });

        if(!currentChatters || currentChatters.length === 0){
            return res.status(200).json({
                success: true,
                message: "No current chatters found",
                data: []
            });
        }

            const participantsIDS = currentChatters.reduce((ids, conversation) => {
                const otherparticipants =  conversation.participants.filter(id => id !== currentUserID);
                return [...ids, ...otherparticipants];
            }, []);

           const otherParticipantsIDS = participantsIDS.filter(id => id.toString() !== currentUserID.toString());

            const user = await User.find({_id:{$in:otherParticipantsIDS}}).select("-password").select("-email");
            
            const users = otherParticipantsIDS.map(id => user.find(user => user._id.toString() === id.toString()));

            res.status(200).json({
                success: true,
                message: "Current chatters fetched successfully",
                data: users
            });
        
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching current chatters",
            error: error.message
        })
    }
}