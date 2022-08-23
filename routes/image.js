const express = require('express')
const router = express.Router()
const User = require('../users')
const multer = require("multer")
let path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public');
    },
    filename: function(req, file, cb) {  
        file.size = 50 * 50
        cb(null, + Date.now() + path.extname(file.originalname));
    }
        
});
    
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const resize = allowedFileTypes.size = 50 * 50;
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });


//pics
router.post("/upload/:userId", upload.single('photo'),async(req, res) => {

    const photo = req.file.filename;
    try {
        await User.findOneAndUpdate({_id: req.params.userId}, 
        {$set: {photo}})
        .then((data) => {
            res.status(200).json(data)
            console.log(data)})
        .catch(console.log)
    } catch (error) {
        console.error(error);
    }
})

router.get("/image/:userId", async(req, res) => {
    await Users.find({_id: req.params.userId, photo})
})


module.exports = router