# Skills Documentation

## Overview

The AI Warlord God Platform comes with **314 pre-installed skills** that provide comprehensive functionality across multiple domains. These skills are organized into categories and can be easily managed through the platform.

## Skill Categories

### 🤖 Autonomous AI Agents
Skills for spawning and managing autonomous AI agents and multi-agent workflows.

#### Key Skills:
- **claude-code**: Delegate coding tasks to Claude Code (Anthropic's CLI agent)
- **codex**: Delegate coding tasks to OpenAI Codex CLI agent
- **hermes-agent**: Complete guide to using and extending Hermes Agent
- **opencode**: Delegate coding tasks to OpenCode CLI agent

### 💰 Trading & Cryptocurrency
Skills for cryptocurrency trading, market analysis, and automated trading systems.

#### Key Skills:
- **bybit-api-testing**: Comprehensive Bybit API testing and validation
- **bybit-api-troubleshooting**: Bybit API authentication and troubleshooting
- **gmgn-trading-bot-master-system**: Complete cryptocurrency trading bot for GMGN
- **ultimate-trading-bot-builder**: Build trading bots with GMGN integration

### 🌐 Web & API Development
Skills for web development, API creation, and web scraping.

#### Key Skills:
- **dogfood**: Systematic QA testing of web applications
- **vercel-env-fix**: Fix Vercel environment variable issues
- **vercel-nextjs-env-var-troubleshooting**: Next.js environment variable troubleshooting
- **webhook-subscriptions**: Create and manage webhook subscriptions

### 🛠️ Development & DevOps
Skills for software development, deployment, and system administration.

#### Key Skills:
- **github-deployment-troubleshooting**: Troubleshoot GitHub deployment issues
- **hermes-agentrouter-simple-setup**: Simple setup for Hermes with AgentRouter
- **hermes-vps-persistence**: Deploy Hermes to VPS with triple-layer persistence

### 🎨 Creative & Media
Skills for creative content generation, including ASCII art, diagrams, and multimedia.

#### Key Skills:
- **architecture-diagram**: Generate professional system architecture diagrams
- **ascii-art**: Generate ASCII art using pyfiglet, cowsay, and more
- **ascii-video**: Production pipeline for ASCII art video
- **creative-ideation**: Generate project ideas through creative constraints

### 📊 Data Science & ML
Skills for data analysis, machine learning, and AI model operations.

#### Key Skills:
- **jupyter-live-kernel**: Use live Jupyter kernel for iterative Python work
- **huggingface-hub**: Hugging Face Hub CLI for model management
- **lm-evaluation-harness**: Evaluate LLMs across 60+ academic benchmarks

### 🏠 Smart Home & IoT
Skills for controlling smart home devices and IoT systems.

#### Key Skills:
- **openhue**: Control Philips Hue lights, rooms, and scenes

### 📱 Social Media & Communication
Skills for interacting with social platforms and communication systems.

#### Key Skills:
- **xitter**: Interact with X/Twitter via terminal client

### 🎮 Gaming & Entertainment
Skills for gaming, game servers, and entertainment applications.

#### Key Skills:
- **minecraft-modpack-server**: Set up modded Minecraft servers
- **pokemon-player**: Play Pokemon games autonomously via headless emulation

## Using Skills

### Web Interface
1. Navigate to the **Skills Library** tab
2. Browse skills by category
3. Click on a skill to view details
4. Use the skill directly or integrate it with agents

### API Usage
```bash
# Get all skills
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  http://localhost:5000/api/skills

# Install a skill
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"skill-name","url":"https://github.com/skill","category":"development"}' \\
  http://localhost:5000/api/skills/install

# Get skill status
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  http://localhost:5000/api/skills/skill-name/status
```

### Script Usage
```bash
# List all skills
node scripts/setup/skills-manager.js list

# Install a skill
node scripts/setup/skills-manager.js install skill-name

# Install all skills
node scripts/setup/skills-manager.js install-all

# Update skills
node scripts/setup/skills-manager.js update
```

## Skill Structure

Each skill follows a consistent structure:

```
skill-name/
├── SKILL.md          # Main skill documentation
├── scripts/          # Skill scripts and executables
├── templates/        # Templates and configurations
├── references/      # Reference materials and docs
└── assets/          # Images, icons, and other assets
```

### SKILL.md Format
```markdown
---
name: skill-name
category: development
description: Brief description of the skill
---

# Skill Name

## Description
Detailed description of what the skill does.

## Usage
How to use the skill, with examples.

## Requirements
Any prerequisites or dependencies.

## Configuration
How to configure the skill.

## API Reference
If the skill provides an API, document it here.
```

## Creating Custom Skills

### 1. Create Skill Directory
```bash
mkdir -p skills/your-skill-name/{scripts,templates,references,assets}
```

### 2. Create SKILL.md
```markdown
---
name: your-skill-name
category: custom
description: Your custom skill description
---

# Your Skill Name

## Description
Detailed description of your skill.

## Usage
How to use your skill.
```

### 3. Add Implementation
Create scripts, templates, or other files in the appropriate directories.

### 4. Install Skill
```bash
node scripts/setup/skills-manager.js install your-skill-name
```

## Skill Integration

### With Agents
Skills can be integrated with agents to extend their capabilities:

```javascript
// Agent with skill integration
const agent = new Agent({
  name: 'Trading Agent',
  type: 'trader',
  skills: ['gmgn-trading-bot-master-system', 'bybit-api-testing']
});
```

### With Webhooks
Skills can trigger webhooks when events occur:

```javascript
// Skill webhook configuration
const skill = {
  name: 'trading-bot',
  webhooks: {
    onTrade: 'http://localhost:5000/api/webhooks/handle/trading-webhook'
  }
};
```

### With APIs
Many skills provide API endpoints that can be called directly:

```javascript
// Call skill API
const result = await axios.get('/api/skills/trading-bot/execute', {
  params: { symbol: 'BTCUSDT' }
});
```

## Best Practices

### 1. Skill Organization
- Organize skills by category
- Use consistent naming conventions
- Provide clear documentation

### 2. Error Handling
- Implement proper error handling
- Provide meaningful error messages
- Log errors for debugging

### 3. Security
- Validate all inputs
- Use secure authentication
- Protect sensitive data

### 4. Performance
- Optimize for performance
- Use caching where appropriate
- Monitor resource usage

### 5. Testing
- Write comprehensive tests
- Test edge cases
- Test integration with other systems

## Troubleshooting

### Common Issues

#### Skill Not Found
- Check if the skill is installed
- Verify the skill name is correct
- Check the skill category

#### Permission Errors
- Ensure proper authentication
- Check user permissions
- Verify API keys

#### Dependency Issues
- Install required dependencies
- Check version compatibility
- Update outdated packages

### Debug Mode
Enable debug mode for detailed logging:

```bash
DEBUG=skills:* node scripts/setup/skills-manager.js list
```

## Contributing Skills

### 1. Fork the Repository
```bash
git clone https://github.com/your-username/ai-warlord-god-platform
cd ai-warlord-god-platform
```

### 2. Create Skill
```bash
mkdir -p skills/your-skill-name
# Create skill files
```

### 3. Test Skill
```bash
node scripts/setup/skills-manager.js install your-skill-name
```

### 4. Submit Pull Request
```bash
git add .
git commit -m "Add new skill: your-skill-name"
git push origin main
```

## Skill Registry

The platform maintains a registry of all available skills:

```javascript
// Get skill registry
const skills = await Skill.find({});
console.log(skills);
```

### Skill Metadata
Each skill in the registry contains:

- **name**: Unique skill identifier
- **category**: Skill category
- **description**: Skill description
- **version**: Skill version
- **status**: Installation status
- **dependencies**: Required dependencies
- **config**: Configuration options

## Advanced Usage

### Skill Chains
Combine multiple skills to create powerful workflows:

```javascript
// Skill chain example
const workflow = [
  'gmgn-trading-bot-master-system',  // Get trading signals
  'bybit-api-testing',               // Test API connection
  'trading-bot'                      // Execute trades
];
```

### Skill Templates
Use skill templates for common patterns:

```javascript
// Load skill template
const template = await loadSkillTemplate('api-endpoint');
const skill = createSkillFromTemplate(template, config);
```

### Skill Hooks
Register hooks for skill events:

```javascript
// Skill hooks
skill.on('installed', () => {
  console.log('Skill installed successfully');
});

skill.on('error', (error) => {
  console.error('Skill error:', error);
});
```

---

🔥 **WITH 314 SKILLS, THE POSSIBILITIES ARE ENDLESS - BUILD, AUTOMATE, CONQUER!** 🔥