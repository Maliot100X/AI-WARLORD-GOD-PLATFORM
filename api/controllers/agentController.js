const { Agent } = require('../models/Agent');

class AgentController {
  async createAgent(req, res) {
    try {
      const { name, type, config } = req.body;
      
      const agent = new Agent({
        name,
        type,
        config,
        status: 'created',
        createdAt: new Date()
      });

      await agent.save();
      
      res.status(201).json({
        success: true,
        data: agent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAgents(req, res) {
    try {
      const agents = await Agent.find({});
      
      res.json({
        success: true,
        data: agents
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async controlAgent(req, res) {
    try {
      const { agentId } = req.params;
      const { action, params } = req.body;
      
      const agent = await Agent.findById(agentId);
      if (!agent) {
        return res.status(404).json({
          success: false,
          error: 'Agent not found'
        });
      }

      // Execute agent action
      const result = await agent.executeAction(action, params);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteAgent(req, res) {
    try {
      const { agentId } = req.params;
      
      const agent = await Agent.findByIdAndDelete(agentId);
      if (!agent) {
        return res.status(404).json({
          success: false,
          error: 'Agent not found'
        });
      }

      res.json({
        success: true,
        message: 'Agent deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AgentController();