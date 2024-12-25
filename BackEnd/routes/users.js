var express = require('express');
var router = express.Router();
const userdata= require("./Schema/model")

router.post("/",async(req,res)=>{
  try {
   const name= req.body.name
   console.log(name,"name");
    const newUser = new userdata(req.body);
    console.log(newUser,"user");
    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User data saved successfully!',
      data: savedUser,
    });
    
  } catch (error) {

    console.error('Error saving user:', error);
    res.status(500).json({
      message: 'Error saving user data.',
      error: error.message,
    });
    
  }



})
router.get("/",async(req,res)=>{
  try {
    const getdata = await userdata.find()
    console.log(getdata,"get user data");
    res.status(200).json(getdata);
    
  } catch (error) {

    console.error('Error get user data:', error);
    res.status(500).json({
      message: 'Error get user data.',
      error: error.message,
    });
    
  }
})

router.delete("/:id", async(req,res)=>{

  const {id}= req.params;

try {
  const deletedUser = await userdata.findByIdAndDelete(id);
  if (!deletedUser) {
    // If no user is found with the given ID
    return res.status(404).json({
      message: 'User not found.',
    });
  }

      // Successfully deleted
      res.status(200).json({
        message: 'User deleted successfully.',
        deletedUser,
      });
} catch (error) {


  console.error('Error get user data:', error);
  res.status(500).json({
    message: 'Error get user data.',
    error: error.message,
  });
  
}
})
router.put("/:id",async(req,res)=>{
try {

  const {id} =req.params;
  const updateddata =req.body;
  const newdata = await userdata.findByIdAndUpdate(id,updateddata)

  if (!newdata) {
    return res.status(404).json({
      message: 'User not found.',
    });
  }
  res.status(200).json({
    message: 'User data updated successfully.',
    newdata,
  });
  
} catch (error) {

  console.error('Error updating user:', error);
  res.status(500).json({
    message: 'Error updating user data.',
    error: error.message,
  });
  
}

})

module.exports = router;
