import mongoose, { Schema } from "mongoose";
import { Jwt } from "jsonwebtoken";
import bcrypt from "bcrypt"

//write user model
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String,  //cloudinary url
            required: true,
        },
        coverImage: {
            type: String,  //cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "Password is required"]  //required is true and also show a custom message
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true   //when timestamps are true then createdAt and updatedAt are also given out
    }
)

//when user want to perform any middle-ware just before save data into database like as
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();  //when password does not change or modifie

    //when password modifie then encrypt password
    this.password = bcrypt.hash(this.password, 10)
    next()
})

//we also write itself methods like checking orignal password and hashing password is same or not and return true or false
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//in same way we also generate a token b/c token is used as like a key of the lock. it means  that person having that key can open that lock in same way that peron having a token can access data or send data to that person only
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//same as RefreshToken generated with some changing
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id, // only id used not more things used in refresh tokens
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
