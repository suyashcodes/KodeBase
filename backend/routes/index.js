var express = require('express');
const { signup, login, createProj, saveProject, getProjects, getProject, deleteProject, updateProject } = require('../controllers/userController');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', signup);
router.post('/login', login);
router.post('/createProject', createProj);
router.post('/saveProject', saveProject);
router.post('/getProjects', getProjects);
router.post('/deleteProject', deleteProject);
router.post('/getProject', getProject);
router.post('/updateProject', updateProject);


module.exports = router;
