import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
{

    subscriber:{
        type: mongoose.Schema.Types.ObjectId, // one who will subscribe
        ref:"User"
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId, // one who will subscribe
        ref:"User"
    }
},
{
    timestamps:true
})

const subscriptionModel = mongoose.model("subscriptionModel",subscriptionSchema);
export {subscriptionModel};