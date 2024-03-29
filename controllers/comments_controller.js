const Comment=require('../models/comment')
const Post=require('../models/post')

// module.exports.create=function(req,res)
// {
//     Post.findById(req.body.post, function(err,post)
//     {
//        if(post)
//        {
//             Comment.create({
//                 content: req.body.content,
//                 post: req.body.post,
//                 user: req.user._id
//             }, function(err, comment)
//             {
//                 post.comments.push(comment);
//                 post.save();

//                 res.redirect('/')
//             })
//        }

//     })
// }


module.exports.create=async function(req,res)
{
    try{

        let post=await Post.findById(req.body.post)
        if(post)
        {
            let comment= await Comment.create({
                content:req.body.content,
                post: req.body.post,
                user: req.user._id
            })
            //Push the comments in the array
            post.comments.push(comment);
            //Used to permanantely save in the database
            post.save();
            req.flash('success','Comment added')
            res.redirect('/')
        }

       
    }

    catch(err)
    {
       req.flash('error', err);
        return res.redirect('/');

    }
}


// module.exports.destroy=function(req,res)
// {
//     Comment.findById(req.params.id, function(err, comment)
//     {
//         if(comment.user == req.user.id)
//         {
//            let postId=comment.post;
//            comment.remove();
//            Post.findByIdAndUpdate(postId,{$pull:{comments: req.params.id}}, function(err, post){
//                 return res.redirect('back')
//            })
//         }
//         else
//         {
//             return res.redirect('back')
//         }
//     })
// }


module.exports.destroy= async function(req,res)
{
    try{
        let comment=await Comment.findById(req.params.id);
        if(comment.user==req.user.id)
        {
            let postId=comment.post;
            comment.remove();
            let post=Post.findByIdAndUpdate(postId,{$pull:{comments: req.params.id}})

            req.flash('success',"Comment Deleted")
            return res.redirect('back')
        }
        else{
           req.flash('error',"comments not allowed")
           return res.redirect('back') 
        }


    }

    catch(err)
    {
        req.flash('error',err)
        return res.redirect('back')
    }
}