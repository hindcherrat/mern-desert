const express = require("express");
const router = express.Router();
const User = require("../models/user")

router.post("/register", async(req, res) => {
  
    const {name , email , password} = req.body

    const newUser = new User({name , email , password})

    try {
        newUser.save()
        res.send('Utilisateur enregistré avec succès ')
    } catch (error) {
         return res.status(400).json({ message: error });
    }

});


router.post("/login", async(req, res) => {

    const {email , password} = req.body

    try {
        
        const user = await User.find({email , password})

        if(user.length > 0)
        {
            const currentUser = {
                name : user[0].name , 
                email : user[0].email, 
                isAdmin : user[0].isAdmin, 
                _id : user[0]._id
            }
            res.send(currentUser);
        }
        else{
            return res.status(400).json({message: "La connexion de l'utilisateur a échoué   "});
        }

    } catch (error) {
           return res.status(400).json({ message: 'Quelque chose s est passé    ' });
    }
  
});


router.get("/getallusers", async(req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        return res.status(400).json({ message: error });
    }
  
});

router.delete("/deleteuser/:id",  async (req, res) => {
    const userId = req.params.id 
    try {
      await User.findByIdAndDelete(userId) 
      res.status(200).send('Utilisateur supprimé avec succès      ') 
    } catch (error) {
      res.status(400).send(error.message) 
    }
  }
);



module.exports = router