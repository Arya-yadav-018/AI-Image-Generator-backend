import { User } from "../models/usermodel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import razorpay from 'razorpay'
import { Transaction } from "../models/transactionmodel.js";

export const register = async(req , res)=>{

try{
   const{name  , email , password } = req.body;
if(!name || !email || !password){
    return res.status(400).json({
        message : "All fields are required" ,
        success : false
    });
}


const user = await User.findOne({email});
if(user){
     return res.status(400).json({ 
        message: "Username already exit try different" 
    });
}

const hashed = await bcrypt.hash(password , 10);


await User.create({
  name,
  email,
  password : hashed,
});


 return res.status(200).json({
    message : "Account created successfully",
    success : true,
})


}catch(error){
     console.error(error);
    return res.status(500).json({
        message : "Could not register",
        success : false
    });

}
}



export const login = async(req , res)=>{
try{
    const{email , password} = req.body;
    if(!email || !password){
       return res.status(400).json({ 
        message: "All fields required" 
    }); 
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({ 
            message: "Username not found" 
    });
    }
   
    const ispasswordmatched = await bcrypt.compare(password , user.password);
    if(!ispasswordmatched){
        return res.status(400).json({
            message : "Incorrect password",
            success : false
        })
    }

    const tokenData = {
          userId : user._id
    }
    
    const token = await jwt.sign(tokenData , process.env.JWT_SECRET, {expiresIn : '1d'});

    return res.status(200).cookie("token", token, {maxAge : 1*24*60*60*1000, httpOnly:true, secure: true,  sameSite: "none" }).json({
        message : `Welcome back ${user.name}`,
        success : true,
         user: {
      name: user.name,
      creditBalance: user.creditBalance, 
    },
    });


}catch(error){
 console.error(error);
    return res.status(500).json({
        message : "Could not login",
        success : false
    });
}
}


// export const userCredits = async(req, res)=>{
// try{

//     const user = await User.findById(req.id );
     
//      if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//         success: false,
//       });
//     }

//     return res.status(200).json({
//          message : "Credit balance",
//         success : true,
//         name : user.name,
//         credits :  user.creditBalance
//     })


// }catch(error){
//     console.error(error);
//     return res.status(500).json({
//         message : "Could not fetch credits",
//         success : false
//     });
// }    
// }


export const getCredits = async (req, res) => {
  try {
     const user = await User.findById(req.id );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      credits: user.creditBalance,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const logout = async (req, res) => {
 try {
    // read token from cookies
    const token = req.cookies.token;
    let creditBalance = 0;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("creditBalance");
      creditBalance = user?.creditBalance || 0;
    }

    // clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
      creditBalance, // <-- actual credit from DB
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
}


// const rezorpayInstance = new razorpay({
//     key_id : process.env.RAZORPAY_KEY_ID,
//     key_secret : process.env.RAZORPAY_KEY_SECRET,
// });

// export const paymentRazorpay = async(req , res)=>{
//        try{

//         const { planId } = req.body

//         const user = await User.findById(req.id );

//         if(red.id || !planId){
//              return res.json({
//                success : false , 
//                message : 'Missing details'
//              })
//         }

//         let credits , plan , amount , date 

//         switch(planId){
//              case 'Basic' : 
//              plan : 'Basic'
//              credits = 100
//              amount = 10
//              break;

//             case 'Advanced' : 
//             plan = 'Advanced'
//              credits = 500
//              amount = 50
//              break;

//               case 'Business' : 
//               plan = 'Business'
//              credits = 5000
//              amount = 250
//              break;

//              default : 
//              return res.json({
//                  success : false,
//                  message : 'plan not found'

//              })

//         }

//         date = Date.now();
//        const transactionData = {
//       userId: user._id,  
//       plan,
//        amount,
//        credits,
//       date: Date.now(),
//     };

//     const newtransaction = await Transaction.create(transactionData)
       
//     const options = {
//       amount : amount * 100,
//       currency : process.env.CURRENCY,
//       receipt : newtransaction._id

//     }
    
//     await razorpayInstance.orders.create(options , (error , order)=>{
//            if(error){
//             console.log(error)
//             return res.json({
//                success: false,
//                message: " purchase failed",
//             })
//            }
//            res.json({
//                success : trusted,
//                order
//            })
//     })   

//        }catch(error){
//          console.log(error)
//          res.json({success : false , message : error.message})
//        }
// }