const express = require('express');
const router = express.Router();

// Temporary storage for blog posts
let posts = [];

// Route to render the homepage with all posts
router.get('/', (req, res) => {
  res.render('index', { posts });
});

// Route to create a new post
router.post('/new', (req, res) => {
  const { title, content, author } = req.body;
  const newPost = {
    title,
    content,
    author,
    date: new Date().toLocaleString(),
  };
  posts.push(newPost);  
  res.redirect('/');  
});

// Route to view a single post
router.get('/post/:id', (req, res) => {
    const postId = parseInt(req.params.id);  
    const post = posts[postId];  
  
    if (post) {
      res.render('posts', { post });  
    } else {
      res.status(404).send('Post not found'); 
    }
  });

// Route to edit the post
router.get('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts[postId];

    if (post) {
        res.render('edit', { post, postId });
    }
    else {
        res.status(404).send('Post not found');
    }
})

// Route to handle post update after form submission
router.post('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);  
    const { title, content, author } = req.body;  
  
    // Update the post in the array
    if (posts[postId]) {
      posts[postId].title = title;
      posts[postId].content = content;
      posts[postId].author = author;
      posts[postId].date = new Date().toLocaleString();  
    }
  
    // Redirect back to the homepage after updating
    res.redirect('/');
  });

// Route to handle post deletion
router.post('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);  
  
    if (postId >= 0 && postId < posts.length) {
      posts.splice(postId, 1);  
    }
  
    // Redirect back to the homepage after deletion
    res.redirect('/');
  });
  
module.exports = router;
