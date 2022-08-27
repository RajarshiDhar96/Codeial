const Post=require('../models/post')
const Comment=require('../models/comment')

// module.exports.create=function(req, res)
// {
//     Post.create({
//         content: req.body.content,
//         user: req.user._id
//     }, function(err, post)
//     {
//        if(err)
//        {
//             console.log("Error in creating post");
//             return
//        }
       
//        return res.redirect('back')
//     })
// }

module.exports.create=async function(req, res)
{
    try{

        let post=await Post.create({
            content: req.body.content,
            user: req.user._id
        })

        if(req.xhr)
        {
            return res.status(200).json({
                data: {
                    post:post
                },
                message:"Post Created"
            })
        }

        req.flash('success','Post Added ')

        return res.redirect('back');


    }
    catch(err)
    {
        req.flash('error',err);
        return res.redirect('back')
    }
}




module.exports.destroy= async function(req,res)
{
    try{

        let post=await Post.findById(req.params.id);

        //"post.user" is basically  a id because in the post schema "user" is of type id
        //Ideally it should be req.user._id but when we compare it we should convert it into string.
        //If we write "req.user.id" , mongoose automatically converts it into string
        if(post.user == req.user.id)
        {
            post.remove();

            await Comment.deleteMany({post: req.params.id});

            if(req.xhr)
            {
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message: "Post deleted"
                })
            }
            req.flash('success','Post has been deleted');
            return res.redirect('back');
        }
        else
        {
            req.flash('error','Post cannot be deleted')
            return res.redirect('back')
        }

    }
    catch(err){

        req.flash('error',err);
        return res.redirect('back')

    }
}