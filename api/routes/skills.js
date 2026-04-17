const express = require('express');
const router = express.Router();
const { 
  getSkills, 
  installSkill, 
  getSkillStatus, 
  uninstallSkill 
} = require('../controllers/skillsController');

// Get all skills
router.get('/', getSkills);

// Install skill
router.post('/install', installSkill);

// Get skill status
router.get('/:skillName/status', getSkillStatus);

// Uninstall skill
router.delete('/:skillName', uninstallSkill);

module.exports = router;