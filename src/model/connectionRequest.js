const mongoose = require("mongoose");


const connectionRequestSchema = mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum :{
            values: ['interested', 'ignored', 'accepted', 'rejected'],
            message: ' status `{VALUE}` is not valid'
          }
    }
},{
    timestamps:true
})

connectionRequestSchema.pre("save",function(next){
    const connectRequest = this;
    if(connectRequest.fromUserId.equals(connectRequest.toUserId)){
        throw new Error("cannot send request to yourself")
    }
    next();
})

connectionRequestSchema.index({fromUserId:1, toUserId:1})

const connectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports ={connectionRequest}