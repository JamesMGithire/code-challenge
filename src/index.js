// write your code here
let image1 = document.getElementById("card-image");
let imgTitle = document.getElementById("card-title");
imgTitle.style.cursor = "pointer";
let likes = document.getElementById("like-count");
let ulComments = document.getElementById("comments-list");
ulComments.innerHTML = "";
ulComments.style.cursor = "pointer";
let likedTimes = 0;
let likeBtn = document.getElementById("like-button");
let post = document.getElementById("comment-form");
let newComment = document.getElementById("comment");

// Populate image title and likes
fetch("http://localhost:3000/images/1")
    .then(resp => resp.json())
    .then(obj => {
        populate(obj);
    })

function populate(obj) {
    image1.src = obj.image;
    image1.id = obj.id;
    imgTitle.textContent = obj.title;
    likedTimes = obj.likes;
    likes.textContent = likedTimes + " likes";
    fetch("http://localhost:3000/comments")
    .then(resp=>resp.json())
    .then(obj=>{
        for(el of obj){
            let com = document.createElement
            ("li")
            com.textContent=el.content;
            ulComments.appendChild(com)
        }
    })
}

function setComments(el) {
    const li = document.createElement('li');
    li.textContent = el.content;
    li.id = el.id;
    ulComments.appendChild(li);
    li.addEventListener("click", () => {
        li.remove();
        let arr = [];
        for (const el of ulComments.childNodes) {
            arr.push(el.textContent)
        }
        fetch(`http://localhost:3000/comments/${li.id}`, {
            method: "DELETE"
        })
    })
}

imgTitle.addEventListener("click", () => {
    image1.style.visibility === "hidden" ?
        image1.style.visibility = "visible"
        : image1.style.visibility = "hidden";
})


image1.addEventListener("click", () => {
    fetch("https://dog.ceo/api/breeds/image/random")
        .then(resp => resp.json())
        .then(obj => {
            return (obj.message)
        }).then(img => {
            patchFetcher(`http://localhost:3000/images/${image1.id}`,{"likes": 0,"image": img})

        })
})

function patchFetcher(url,obj){
    fetch(url,{
        method: "PATCH",
        body: JSON.stringify(obj),
        headers: {
            "Content-type": "application/json"
        }
    })
}


// patch likes
function patchLikes(myId) {
    patchFetcher(`http://localhost:3000/images/${myId}`, {"likes": likedTimes})
}

likeBtn.addEventListener("click", () => {
    likedTimes += 1;
    likes.textContent = likedTimes + " likes";
    patchLikes(image1.id);
})

post.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(newComment.value);
    fetch("http://localhost:3000/comments", {
        method: "POST",
        body: JSON.stringify({
            "imageId": parseInt(image1.id),
            "content": newComment.value
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
})
