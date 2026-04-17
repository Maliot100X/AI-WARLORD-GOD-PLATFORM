#!/usr/bin/env node

const { Agent } = require('../../api/models/Agent');
const mongoose = require('mongoose');

console.log('🤖 AI WARLORD GOD PLATFORM - AGENT MANAGER');
console.log('=============================================\n');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-warlord', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Create agent function
async function createAgent(name, type, config = {}) {
  try {
    const agent = new Agent({
      name,
      type,
      config,
      status: 'created'
    });

    await agent.save();
    console.log(`✅ Agent ${name} created successfully with ID: ${agent._id}`);
    return agent;
  } catch (error) {
    console.error(`❌ Failed to create agent ${name}:`, error.message);
    throw error;
  }
}

// List agents function
async function listAgents() {
  try {
    const agents = await Agent.find({});
    
    if (agents.length === 0) {
      console.log('No agents found.');
      return;
    }
    
    console.log('Agents:');
    agents.forEach(agent => {
      console.log(`  - ${agent.name} (${agent.type}) - Status: ${agent.status}`);
    });
  } catch (error) {
    console.error('❌ Failed to list agents:', error.message);
  }
}

// Control agent function
async function controlAgent(agentId, action, params = {}) {
  try {
    const agent = await Agent.findById(agentId);
    if (!agent) {
      console.error(`❌ Agent with ID ${agentId} not found.`);
      return;
    }

    const result = await agent.executeAction(action, params);
    console.log(`✅ Agent ${agent.name} executed ${action}:`);
    console.log(`  Status: ${result.status}`);
    console.log(`  Success: ${result.success}`);
    console.log(`  Timestamp: ${result.timestamp}`);
  } catch (error) {
    console.error(`❌ Failed to control agent ${agentId}:`, error.message);
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run agent -- [create|list|control] [args...]');
    process.exit(1);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'create':
      if (args.length < 3) {
        console.error('❌ Usage: npm run agent -- create <name> <type> [config-json]');
        process.exit(1);
      }
      
      const name = args[1];
      const type = args[2];
      const config = args[3] ? JSON.parse(args[3]) : {};
      
      await createAgent(name, type, config);
      break;
      
    case 'list':
      await listAgents();
      break;
      
    case 'control':
      if (args.length < 3) {
        console.error('❌ Usage: npm run agent -- control <agent-id> <action> [params-json]');
        process.exit(1);
      }
      
      const agentId = args[1];
      const action = args[2];
      const params = args[3] ? JSON.parse(args[3]) : {};
      
      await controlAgent(agentId, action, params);
      break;
      
    default:
      console.error(`❌ Unknown command: ${command}`);
      process.exit(1);
  }
  
  // Close MongoDB connection
  mongoose.connection.close();
}

main().catch(console.error);