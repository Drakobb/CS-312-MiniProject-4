const express = require('express');
const router = express.Router();

// Temporary storage for blog posts
let posts = [];

// Route to return all posts as JSON
router.get('/api/posts', (req, res) => {
    res.json(posts);  // Send posts array as JSON
});

// Route to create a new post
router.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body;
    const newPost = {
        title,
        content,
        author,
        date: new Date().toLocaleString(),
    };
    posts.push(newPost);
    res.json(newPost);  // Respond with the newly created post data
});

// Route to view a single post
router.get('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts[postId];

    if (post) {
        res.json(post);  // Respond with the specific post data
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// Route to edit a post
router.post('/api/posts/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, content, author } = req.body;

    if (posts[postId]) {
        posts[postId] = {
            title,
            content,
            author,
            date: new Date().toLocaleString(),
        };
        res.json(posts[postId]);  // Respond with the updated post data
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// Route to delete a post
router.post('/api/posts/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);

    if (postId >= 0 && postId < posts.length) {
        posts.splice(postId, 1);
        res.json({ success: true });  // Respond with success message
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

module.exports = router;
