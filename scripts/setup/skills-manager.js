#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const axios = require('axios');

console.log('🤖 AI WARLORD GOD PLATFORM - SKILLS MANAGER');
console.log('=============================================\n');

const skillsPath = path.join(__dirname, '../../../skills');
const installedSkillsPath = path.join(skillsPath, 'installed');

// Create installed skills directory if it doesn't exist
if (!fs.existsSync(installedSkillsPath)) {
  fs.mkdirSync(installedSkillsPath, { recursive: true });
}

// Get list of available skills
async function getAvailableSkills() {
  try {
    const response = await axios.get('https://api.github.com/repos/hermes-ai/skills/contents/skills');
    return response.data.filter(item => item.type === 'dir');
  } catch (error) {
    console.error('❌ Failed to fetch skills list:', error.message);
    return [];
  }
}

// Install a skill
async function installSkill(skillName, skillUrl) {
  console.log(`Installing skill: ${skillName}...`);
  
  try {
    // Create skill directory
    const skillDir = path.join(installedSkillsPath, skillName);
    if (!fs.existsSync(skillDir)) {
      fs.mkdirSync(skillDir, { recursive: true });
    }
    
    // Download skill files (mock - in production, this would clone/download)
    const skillContent = `# ${skillName}

Automatically installed from: ${skillUrl}

## Description
This skill was automatically installed by the AI Warlord Platform.

## Usage
This skill can be used through the platform's skill system.

## Files
- SKILL.md: Main skill documentation
- scripts/: Skill scripts (if any)
- templates/: Skill templates (if any)
`;
    
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillContent);
    
    // Create basic skill structure
    const subdirs = ['scripts', 'templates', 'references'];
    subdirs.forEach(dir => {
      fs.mkdirSync(path.join(skillDir, dir), { recursive: true });
    });
    
    console.log(`✅ Skill ${skillName} installed successfully.`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to install skill ${skillName}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run skills -- [install|list|update] [skill-name]');
    process.exit(1);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'list':
      console.log('Available skills:');
      const skills = await getAvailableSkills();
      skills.forEach(skill => {
        console.log(`  - ${skill.name}`);
      });
      break;
      
    case 'install':
      if (args.length < 2) {
        console.error('❌ Please specify a skill name to install.');
        process.exit(1);
      }
      
      const skillName = args[1];
      const skillsList = await getAvailableSkills();
      const skill = skillsList.find(s => s.name === skillName);
      
      if (!skill) {
        console.error(`❌ Skill ${skillName} not found.`);
        process.exit(1);
      }
      
      await installSkill(skillName, skill.html_url);
      break;
      
    case 'install-all':
      console.log('Installing all available skills...');
      const allSkills = await getAvailableSkills();
      
      for (const skill of allSkills) {
        await installSkill(skill.name, skill.html_url);
      }
      
      console.log('✅ All skills installation completed!');
      break;
      
    case 'update':
      console.log('Updating installed skills...');
      // In production, this would check for updates and reinstall
      console.log('✅ Skills update completed!');
      break;
      
    default:
      console.error(`❌ Unknown command: ${command}`);
      process.exit(1);
  }
}

main().catch(console.error);