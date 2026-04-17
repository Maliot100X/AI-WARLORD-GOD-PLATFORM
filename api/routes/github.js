const express = require('express');
const router = express.Router();
const { 
  analyzeRepo, 
  createPR, 
  createIssue, 
  getRepoStatus 
} = require('../controllers/githubController');

// Analyze repository
router.post('/analyze', analyzeRepo);

// Create pull request
router.post('/pr', createPR);

// Create issue
router.post('/issue', createIssue);

// Get repository status
router.get('/:owner/:repo/status', getRepoStatus);

module.exports = router;