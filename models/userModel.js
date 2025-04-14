import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const { Schema } = mongoose;

const userSchema = new Schema({
    name : {
        // type data
        type : String,
        // rules untuk masing masing field, dengan pesan error di setelah true (kalo kosong datanya)
        required : [true, "Name harus diisi"],
        // tidak ada username yang sama, mirip seperti primary key
        unique : [true, "Username sudah digunakan, silahkan buat yang lain"],
    },
    email : {
        type : String,
        required : [true, "Email harus diisi"],
        unique : [true, "Email sudah didaftarkan"],
        validate : {
            validator: validator.isEmail,
            message: "Inputan harus berformat yang valid"
        }
    },
    password : {
        type : String,
        required : [true, "Password harus diisi"],
        minLength: [6, "Password minimal 6 karakter"]
    },
    role: {
        type: String,
        enum: ["user", "owner"],
        default: "user"
    }
})

userSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10)
    // this ini mengacu pada userSchema
    this.password = await bcrypt.hash(this.password, salt)
})

// perbandingan input password sama password yang di database
userSchema.methods.comparePassword = async function (reqBody) {
    return await bcrypt.compare(reqBody, this.password)
}

const User = mongoose.model("User", userSchema)

export default User