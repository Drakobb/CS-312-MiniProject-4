import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlogList = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [editingPostId, setEditingPostId] = useState(null);

    useEffect(() => {
        axios.get('/api/posts')
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error("Error fetching posts:", error);
            });
    }, []);

    const handleCreateOrEditPost = (e) => {
        e.preventDefault();
        const postData = { title, content, author };

        if (editingPostId !== null) {
            axios.post(`/api/posts/edit/${editingPostId}`, postData)
                .then(response => {
                    setPosts(posts.map((post, index) =>
                        index === editingPostId ? response.data : post
                    ));
                    resetForm();
                })
                .catch(error => console.error("Error updating post:", error));
        } else {
            axios.post('/api/posts', postData)
                .then(response => {
                    setPosts([...posts, response.data]);
                    resetForm();
                })
                .catch(error => console.error("Error creating post:", error));
        }
    };

    const handleDeletePost = (postId) => {
        axios.post(`/api/posts/delete/${postId}`)
            .then(response => {
                if (response.data.success) {
                    setPosts(posts.filter((_, index) => index !== postId));
                }
            })
            .catch(error => console.error("Error deleting post:", error));
    };

    const handleEditClick = (postId) => {
        const post = posts[postId];
        setTitle(post.title);
        setContent(post.content);
        setAuthor(post.author);
        setEditingPostId(postId);
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setAuthor('');
        setEditingPostId(null);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">{editingPostId !== null ? "Edit Post" : "Create a New Post"}</h2>
            <form onSubmit={handleCreateOrEditPost} className="mb-4">
                <div className="form-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary me-2">
                    {editingPostId !== null ? "Update Post" : "Create Post"}
                </button>
                {editingPostId !== null && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                        Cancel Edit
                    </button>
                )}
            </form>

            <h2>Blog Posts</h2>
            <div className="row">
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <div key={index} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text">{post.content}</p>
                                    <small className="text-muted">By: {post.author} on {post.date}</small>
                                    <div className="mt-3">
                                        <button onClick={() => handleEditClick(index)} className="btn btn-sm btn-outline-primary me-2">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeletePost(index)} className="btn btn-sm btn-outline-danger">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No posts available</p>
                )}
            </div>
        </div>
    );
};

export default BlogList;
