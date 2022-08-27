const Post=require("../../../models/post")
const Comment=require("../../../models/comment")

module.exports.index=async function(req,res)
{
    let posts=await Post.find({})
        //So the post are arranged in a sorted order
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
    return res.json(200,{
        message:"List Of Post",
        posts:posts
    })
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

            // if(req.xhr)
            // {
            //     return res.status(200).json({
            //         data:{
            //             post_id:req.params.id
            //         },
            //         message: "Post deleted"
            //     })
            // }
            // req.flash('success','Post has been deleted');
            return res.json(200,{
                message:"Post and associated comments deleted successfully"
            })
        }
        else
        {
            return res.json(401,{
                message:"You cannot delete the post"
            })
        }

    }
    catch(err){

       return res.json(500,{
        message: "Internal server error"
       })

    }
}