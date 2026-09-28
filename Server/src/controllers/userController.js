const userModel = require("../models/userModel");


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { isValid,
    isValidEmail,
    isValidFullName,
    isValidPassword,
    isValidObjectId,
    isValidPhone } = require("../utils/validator");


// Sign Up 
const signup = async (req, res) => {
    try {
        let userData = req.body;
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ msg: "Bad Request || No Data Provided" });
        }
        let { fullName, email, password, phone, role, gender, bio } = userData;
        // full Name Validation 
        if (!isValid(fullName)) {
            return res.status(400).json({ msg: "Full Name is Required" });
        }

        if (!isValidFullName(fullName)) {
            return res.status(400).json({ msg: "Invalid FullName" })
        }

        // email Vaildation 
        if (!isValid(email)) {
            return res.status(400).json({ msg: "Email is required" });

        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ msg: "Invalid Email " })
        }

        let duplicateEmail = await userModel.findOne({ email });
        if (duplicateEmail) {
            return res.status(400).json({ msg: "Email Already Exists" })
        }

        // Password Validation 
        if (!isValid(password)) {
            return res.status(400).json({ msg: "Password is required" });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({ msg: " Invalid Password" });
        }

        // Phone Validation 
        if (!isValid(phone)) {
            return res.status(400).json({ msg: "Phone is required" });
        }
        if (!isValidPhone(phone)) {
            return res.status(400).json({ msg: "Invaild Phone Number" })
        }
        let duplicatePhone = await userModel.findOne({ phone });

        if (duplicatePhone) {
            return res.status(400).json({ msg: "Phone Number is Already Exists" })
        }

        // role Validation
        if (role !== undefined) {
            if (role !== "user" && role !== "owner") {
                return res.status(400).json({ msg: "Invalid Role" })
            }
        }

        // gender Validation
        if (gender !== undefined) {
            if (gender !== "male" && gender !== "female" && gender !== "other") {
                return res.status(400).json({ msg: "Invalid gender" });
            }
        }

        // bio Validation
        if (bio !== undefined) {
            if (bio.length < 15) {
                return res.status(400).json({ msg: "bio must be 15 characters long" });
            }
        }

        // profile Image Validation
        if (req.file) {
            userData.profileImage = req.file.filename;
        }

        // password hashing 
        const hashPassword = await bcrypt.hash(password, 10);
        userData.password = hashPassword;

        let user = await userModel.create(userData);

        return res.status(201).json({ msg: "Signup Successfully", user })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Intenal server Error" });
    }
}

// Login 
const login = async (req, res) => {
    try {
        let userData = req.body;
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ msg: "Bad Request || No Data Provided" });
        }

        let { email, password } = userData;

        if (!isValid(email)) {
            return res.status(400).json({ msg: "Email is required" });

        }
        if (!isValid(password)) {
            return res.status(400).json({ msg: "Password is required" });
        }

        // for find if email is exists or not
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User Not found" });
        }

        // for check our password is match with the existing password
        let passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ msg: "Incorrect password" })
        }

        let token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "3d" },
        );

        return res.status(200).json({
            msg: "Login Successfully", token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Intenal server Error" });
    }
}

// get My Profile 
const getMyProfile = async (req, res) => {
    try {
        let userId = req.userId;

        let user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "No User found" });
        }
        return res.status(200).json({ msg: "Profile Fetched Successfully", user });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Intenal server Error" });
    }


}


// Update Profile 
const updateMyProfile = async (req, res) => {
    try {
        let userId = req.userId;
        let userData = req.body;

        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ msg: "Bad Request || No Data Provided" });
        }
        let { fullName, email, password, phone, gender, bio } = userData;

        // full Name Validation 
        if (fullName !== undefined) {
            if (!isValid(fullName)) {
                return res.status(400).json({ msg: "Full Name is Required" });
            }

            if (!isValidFullName(fullName)) {
                return res.status(400).json({ msg: "Invalid FullName" })
            }
        }

        // email Vaildation 
        if (email !== undefined) {
            if (!isValid(email)) {
                return res.status(400).json({ msg: "Email is required" });

            }
            if (!isValidEmail(email)) {
                return res.status(400).json({ msg: "Invalid Email " })
            }

            let duplicateEmail = await userModel.findOne({ email, _id: { $ne: userid } });
            if (duplicateEmail) {
                return res.status(400).json({ msg: "Email Already Exists" })
            }
        }
        // password Validation
        if (password !== undefined) {
            if (!isValid(password)) {
                return res.status(400).json({ msg: "Password is required" });
            }

            if (!isValidPassword(password)) {
                return res.status(400).json({ msg: " Invalid Password" });
            }

            // password hashing 
            const hashPassword = await bcrypt.hash(password, 10);
            userData.password = hashPassword;
        }

        if (phone !== undefined) {
            if (!isValid(phone)) {
                return res.status(400).json({ msg: "Phone is required" });
            }
            if (!isValidPhone(phone)) {
                return res.status(400).json({ msg: "Invaild Phone Number" })
            }
            let duplicatePhone = await userModel.findOne({ phone, _id: { $ne: userId } });

            if (duplicatePhone) {
                return res.status(400).json({ msg: "Phone Number is Already Exists" })
            }
        }


        if (bio !== undefined) {
            if (bio.length < 15 && bio.length > 200) {
                return res
                    .status(400)
                    .json({ msg: "Bio Cannot be less than 15 Characters." });
            }
        }

        if (req.file) {
            userData.profileImage = req.file.filename;
        }

        let updatedUserProfile = await userModel.findByIdAndUpdate(
            userId,
            userData,
            { new: true },
        ).select("-password");

        return res
            .status(200)
            .json({ msg: "Profile Updated Successfully", updatedUserProfile });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Intenal server Error" });
    }

}

// Delete Profile
const deleteProfile = async (req, res) => {
    try {
        let userId = req.userId;

        let deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ msg: "User Not Found or Already Deleted" });
        }
        return res.status(200).json({ msg: "Profile Deleted Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Get All  (Adimin)

const getAllUsers = async (req, res) => {
    try {
        let { role } = req.query;
        let filter = {};

        if (role !== undefined) {
            if (role !== "user" && role !== "owner" && role !== "admin") {
                return res.status(400).json({ msg: "Invalid Role" })
            }
            filter.role = role;
        }

        let users = await userModel.find(filter).select("-password");

        if (users.length === 0) {
            return res.status(404).json({ msg: "No User Found" })
        }
        return res.status(200).json({ msg: "Users Fetched Successfully", users })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}


// Delete Any User (Admin)
const deleteAny = async (req, res) => {
    try {
        let userId = req.params.id;
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ msg: "Invalid User Id" })
        }

        let user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "No User Found" });
        }
        if (user.role == "admin") {
            return res.status(403).json({ msg: "Admin Cannot be Deleted" });
        }

        await userModel.findByIdAndDelete(userId);
        return res.status(200).json({ msg: "Profile Deleted Successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}
module.exports = { signup, login, getMyProfile, updateMyProfile, deleteProfile, getAllUsers, deleteAny }

