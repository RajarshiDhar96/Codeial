
// method to submit the form data for new post using AJAX
{
    console.log("Hello World");
   
    let createPost=function()
    {
        let newPostForm=$('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type:'post',
                url:'/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost=newPostDom(data.data.post);
                    $('#post-list-container>ul').prepend(newPost)
                    //to put the "deletePost" function in every link of the "delete button" of "newPost"
                    deletePost($(' .delete-post-button', newPost))
                    
                },error:function(error){
                    console.log(error.responseText);
                }
            })
        })
    }



//Method to create a post in DOM

let  newPostDom=function(post)
{
    return $(`<li class="full-post-container" id="post-${post._id}">
    <p> 
           
           
            <small id="post-user">
                    ${post.user.name}<br>
            </small>
           
                <a href="/posts/destroy/${post._id}" id="delete-button" class="delete-post-button"> Delete</a>
            
            <p>
                <div id="content">
                    ${post.content}
                </div>
               
            </p>
            
            
           
            
    </p>

    <div class="post-comments">
          
                    <form action="/comments/create" method="POST" id="comment-text-area">
                            <input type="text" name="content" placeholder="Type here to add comment..." required>
                            <input type="hidden" name="post" value="${post._id}">
                            <input type="submit" value="Add Comment" id="comment-submit">


                    </form>

          
            <div class="post-comments-list">
                    <ul id="post-comments-${post._id}">
                        
                    </ul>
            </div>
    </div> 
</li>`)
}


//method to delete a post from DOM
// <a> tag will be passed in the deleteLink
let deletePost=function(deleteLink)
{
    $(deleteLink).click(function(e)
    {
        e.preventDefault();

        $.ajax({
            type:'get',
            //To get the href part of the <a> tag
            url:$(deleteLink).prop('href'),
            success:function(data)
            {
                $('#post-${data.data.post._id}').remove();

            },error: function(error)
            {
                console.log(error.responseText);
            }
        })
    })
}

createPost()
}