const mongoose = require("mongoose");

const User = mongoose.model("user", {
    username: {type: String, required: [true, "What's your username? I need an username!"]},
    password: {type: String, required: [true, "I need a password man!"]},
    email: {
        type: String, 
        required: [true, "I need a way to contact you. Email pleeease"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    firstname: String,
    lastname: String
})

module.exports = User;