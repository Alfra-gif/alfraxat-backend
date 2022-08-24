const User = require("../models/user_model");
const Chat = require("../models/chat_model");

const md5 = require('md5');
const jwt = require('jsonwebtoken');
const request = require('request')
var fs = require("fs");
var path = require("path");

controller = {
    save_user: function(req,res){

        var users = new User();
        var params = req.body;
        
        users.username = params.username;
        users.email = params.email;
        users.password = md5(params.password);
        users.date = new Date();

        User.findOne({ $or: [{ username: users.username }, { email: users.email }] }, (err,user) => {
            if (err){
                //console.log(err);

                return res.status(500).send({message: "error al retornar les dades"});
            }

            if(!user){
                users.save((err, userStored) => {

                    if (err) return res.status(500).send({message: "Error al desar el document"});
                
                    if(!userStored) return res.status(404).send({message: "Document no desat"});
                
                    return res.status(200).send({user: userStored});
                });    
            } 

            if(user){
                return res.status(500).send({message: "el projecte ja existeix"});
            }
        })  
    },
    login: function(req,res){
        const user = {
            id: req.body.id,
            email: req.body.email,
            password: md5(req.body.password)
        }
        if (req.body.email == null) return res.status(500).send({message: "no has especificat cap dels objectes"})

        else {

            User.findOne({email:req.body.email}, (err,user) => {
                if (err){
                    //console.log(err);
                    return res.status(500).send({message: "error al retornar les dades"});
                }
                if(!user) return res.status(404).send({message: "el projecte no existeix"});

                if(user){
                    if(user.password == md5(req.body.password)){
                        jwt.sign({user},'secretKey',
                            user.password = undefined,
                            (err, userToken) => {
                                res.json({
                                    userToken
                                })
                            }
                        );
                    } 
                }
            })
        }
    },
    // Authorization: Bearer <token>
    verify_token: function(req,res){
        const bearer_header = req.headers["authorization"];

        if(typeof bearer_header !== "undefined"){
            const token = bearer_header.split(" ")[1];
            req.token = token;

            jwt.verify(req.token, "secretKey", (error, authData) => {
                if (error){
                    res.sendStatus(403);
                } else {
                    authData.user.password = undefined
                    res.json(
                        {
                            menssage: "post created",
                            authData: authData
                        }
                    )
                }
            })
        
        } else {
            res.sendStatus(403);
        }
    },
    update_user: function(req,res){

        const id = req.body._id
        const friends = req.body.friends
        const username = req.body.username
        const email = req.body.email
        const requests = req.body.requests
        console.log(req.body)
        User.findByIdAndUpdate({_id: id}, { friends: friends, username: username, email: email , requests: requests}, (err, user) => {

            if (err){
                console.log(err);
                return res.status(500).send({message:"error al retornar les dades"});
            }
            if (!user) return res.status(404).send({message:"el projecte no existeix"});
    
            return res.status(200).send({
                user
            })

            
        }) 

    },
    get_user: function(req,res){
        
        if (req.params.id==null) return res.status(500).send({message:"no has especificat cap projecte"})
        else{
            User.findById(req.params.id, (err,user)=>{
                if (err){
                    console.log(err);
                    return res.status(500).send({message:"error al retornar les dades"});
                }
                if (!user) return res.status(404).send({message:"el projecte no existeix"});

                return res.status(200).send({
                    user
                })
            })
        }
    },
    get_users: function(req,res){

        project.findById(projectId, (err,project) => {
            if (err){
                console.log(err);
                return res.status(500).send({message: "error al retornar les dades"});
            }
            if(!project) return res.status(404).send({message: "el projecte no existeix"});

            return res.status(200).send({
                project
            })
        })
    },
    search_user: function(req,res){
        User.find({ username: { $regex: ".*" + req.params.username + ".*" }}, (err, user) => {
        //User.find({ username: req.params.username }, (err, user) => {

            if (err){
                console.log(err);
                return res.status(500).send({message: "error al retornar les dades"});
            }
            if(!user) return res.status(404).send({message: "el projecte no existeix"});

            return res.status(200).send({
                user
            })
        })
    },
    delete_chat: function(req,res){
        
        var userId = req.params.id;

        User.findByIdAndDelete(userId, (err, userRemoved) => {
            if (err){
                return res.status(500).send({message: "Error, objecte no trobat"});
            }
            if (!userRemoved) return res.status(404).send({message: "no existeis el projecte a esborrar"});
            return res.status(200).send({
                user: userRemoved
            })
        })
    },
    upload_image:function(req,res){
        var userId = req.params.id;
        var fileName = "imatge no pujada";

        if (req.files){
            var filePath = req.files.image.path;
            var fileSplit = filePath.split("/");
            var fileName = fileSplit[1];
            console.log("a");
            User.findByIdAndUpdate(userId, {image: fileName}, {new:true}, (err, user_updated) => {
                if (err) {
                    return res.status(500).send({message: "Error actualitzant la imatge"});
                }
                if (!user_updated) return res.status(404).send({message: "No existeix el projecte"});
                return res.status(200).send({
                    user: user_updated
                });
            });
        } else {
            return res.status(500).send({
                message: fileName
            })
        }
    },
    get_image:function(req,res){
        var file = req.params.image;
        var path_file = "./uploads/"+file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(200).send({
                    message: "no hi ha la imatge"
                });
            }
        });
    },
    create_chat: function (req,res){

        var private_chats = new Chat();
        var params = req.body;

        private_chats.users_array = params.users_array
        private_chats.messages = params.messages
        private_chats.date = new Date()
        console.log(params)
        
        var inverted_users_array = [private_chats.users_array[1],private_chats.users_array[0]]

        Chat.findOne({ $or: [{users_array: private_chats.users_array}, {users_array:inverted_users_array}] }, (err,chat) => {
            if (err){
                //console.log(err);

                return res.status(500).send({message: "error al retornar les dades"});
            }

            if(!chat){
                private_chats.save((err, chatStored) => {

                    if (err) return res.status(500).send({message: "Error al desar el document"});
                
                    if(!chatStored) return res.status(404).send({message: "Document no desat"});
                
                    return res.status(200).send({private_chats: chatStored});
                });   
            } 

            if(chat){
                return res.status(200).send({chat});
            }
        })  

    },
    insert_message: function (req,res){

        var private_chats = new Chat();
        var params = req.body;

        private_chats._id = params._id
        private_chats.users_array = params.users_array
        private_chats.messages = params.messages

        console.log(params)

        Chat.findByIdAndUpdate(private_chats._id, { messages: private_chats.messages }, (err, chat) => {

            if (err){
                console.log(err);
                return res.status(500).send({message:"error al retornar les dades"});
            }
            if (!chat) return res.status(404).send({message:"el projecte no existeix"});
    
            return res.status(200).send({
                chat
            })

            
        }) 
    },
    get_chat: function(req,res){
        if (req.params.id==null) return res.status(500).send({message:"no has especificat cap projecte"})
        else{
            Chat.findById(req.params.id, (err,chat)=>{
                if (err){
                    console.log(err);
                    return res.status(500).send({message:"error al retornar les dades"});
                }
                if (!chat) return res.status(404).send({message:"el projecte no existeix"});

                return res.status(200).send({
                    chat
                })
            })
        }
    },

};
module.exports = controller;