const express =  require('express')
const router = express.Router();
const postController = require('../controller/post')

router.get('/',postController.getAllPosts);
router.post('/add',postController.addPost);
router.put('/update/:id',postController.updatePost);
router.get('/:id',postController.getById);
router.delete('/:id',postController.deletePost);
router.get('/user/:id',postController.getUserById);
router.post('/like/:postId/:userId',postController.likeThePost);
router.post('/dislike/:postId/:userId',postController.dislikeThePost);
router.post('/comment/:postId', postController.addCommentToPost);

module.exports = router;