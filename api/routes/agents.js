const express = require('express');
const router = express.Router();
const { createAgent, getAgents, controlAgent, deleteAgent } = require('../controllers/agentController');

// Create a new agent
router.post('/', createAgent);

// Get all agents
router.get('/', getAgents);

// Control an agent
router.post('/:agentId/control', controlAgent);

// Delete an agent
router.delete('/:agentId', deleteAgent);

module.exports = router;