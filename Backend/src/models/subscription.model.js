import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
{

    subscriber:{
        types: mongoose.Schema.Types.ObjectId, // one who will subscribe
        type:"User"
    },
    channel:{
        types: mongoose.Schema.Types.ObjectId, // one who will subscribe
        type:"User"
    }
},
{
    timestamps:true
})

const subscriptionModel = mongoose.model("subscriptionModel",subscriptionSchema);
export {subscriptionModel};