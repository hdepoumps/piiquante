const Sauce = require("../models/Sauces");

exports.createSauce = (req,res,next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    console.log("voici ma sauce :"+sauce);
    sauce.save()
        .then(()=> res.status(201).json({ message:'Objet enregistré !'}))
        .catch(error => res.status(400).json({error}));
};


exports.modifySauce = (req,res,next)=>{
    Sauce.updateOne( {_id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(()=> res.status(200).json({message:'Objet modifié !'}))
        .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces =(req,res,next)=>{
    Sauce.find()
        .then(Sauces => res.status(200).json(Sauces))
        .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce =>res.status(200).json(sauce))
        .catch(error =>res.status(404).json({error}));
};

exports.addLike = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log("hey");
            const userId = req.body.userId;
            const sauceLike = req.body.like;
            if (sauceLike === 1) {
                sauce.likes += 1;
                sauce.usersLiked.push(userId);
                if (sauce.usersDisliked.includes(userId)){
                    sauce.usersDisliked = sauce.usersDisliked.filter(userDisliked => userDisliked !== userId);
                    sauce.dislikes += - 1;
                }
                console.log(sauce.likes + ' ' + sauce.usersLiked);

            }
            if (sauceLike === 0) {
                if (sauce.usersLiked.includes(userId)){
                    sauce.usersLiked = sauce.usersLiked.filter(userLiked => userLiked !== userId);
                    sauce.likes += - 1;
                }
                if (sauce.usersDisliked.includes(userId)){
                    sauce.usersDisliked = sauce.usersDisliked.filter(userDisliked => userDisliked !== userId);
                    sauce.dislikes += - 1;
                }
                console.log("plus de like ou dislike");
            }
            if (sauceLike === -1) {
                sauce.dislikes = sauce.dislikes + 1;
                sauce.usersDisliked.push(userId);
                if (sauce.usersLiked.includes(userId)){
                    sauce.usersLiked = sauce.usersLiked.filter(userLiked => userLiked !== userId);
                    sauce.likes += - 1;
                }
                console.log("dislike");
            }
            return sauce.save();
        })
        .then((updatedSauce) => {
            res.status(200).json(updatedSauce);
        })
        .catch(error => res.status(404).json({ error }));
};
