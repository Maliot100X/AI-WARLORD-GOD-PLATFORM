const { Skill } = require('../models/Skill');
const fs = require('fs').promises;
const path = require('path');

class SkillsController {
  constructor() {
    this.skillsPath = path.join(__dirname, '../../../skills');
  }

  async getSkills(req, res) {
    try {
      const skills = await Skill.find({});
      
      // Also get skills from filesystem
      const fsSkills = await this._getSkillsFromFilesystem();
      
      res.json({
        success: true,
        data: {
          database: skills,
          filesystem: fsSkills
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async installSkill(req, res) {
    try {
      const { name, url, category } = req.body;
      
      // Download skill
      const skillPath = await this._downloadSkill(name, url);
      
      // Install skill dependencies
      await this._installSkillDependencies(skillPath);
      
      // Create skill record in database
      const skill = new Skill({
        name,
        url,
        category,
        status: 'installed',
        installedAt: new Date()
      });

      await skill.save();
      
      res.status(201).json({
        success: true,
        data: skill
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getSkillStatus(req, res) {
    try {
      const { skillName } = req.params;
      
      const skill = await Skill.findOne({ name: skillName });
      if (!skill) {
        return res.status(404).json({
          success: false,
          error: 'Skill not found'
        });
      }

      // Check if skill is actually installed
      const isInstalled = await this._checkSkillInstalled(skillName);
      
      res.json({
        success: true,
        data: {
          name: skill.name,
          status: isInstalled ? 'installed' : 'not_installed',
          category: skill.category,
          installedAt: skill.installedAt
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async uninstallSkill(req, res) {
    try {
      const { skillName } = req.params;
      
      const skill = await Skill.findOneAndDelete({ name: skillName });
      if (!skill) {
        return res.status(404).json({
          success: false,
          error: 'Skill not found'
        });
      }

      // Remove skill from filesystem
      await this._removeSkill(skillName);

      res.json({
        success: true,
        message: `Skill ${skillName} uninstalled successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async _getSkillsFromFilesystem() {
    try {
      const categories = await fs.readdir(this.skillsPath);
      const skills = [];

      for (const category of categories) {
        const categoryPath = path.join(this.skillsPath, category);
        const stat = await fs.stat(categoryPath);

        if (stat.isDirectory()) {
          const skillFiles = await fs.readdir(categoryPath);
          
          for (const skillFile of skillFiles) {
            if (skillFile.endsWith('.md')) {
              const skillName = path.basename(skillFile, '.md');
              skills.push({
                name: skillName,
                category,
                path: path.join(categoryPath, skillFile)
              });
            }
          }
        }
      }

      return skills;
    } catch (error) {
      return [];
    }
  }

  async _downloadSkill(name, url) {
    // Mock download - in production, this would actually download from URL
    const skillPath = path.join(this.skillsPath, 'downloaded', name);
    await fs.mkdir(skillPath, { recursive: true });
    
    // Create a basic skill file
    const skillContent = `# ${name}

Downloaded from: ${url}

## Description
This skill was automatically downloaded and installed.

## Usage
Use this skill via the AI Warlord Platform.
`;
    
    await fs.writeFile(path.join(skillPath, `${name}.md`), skillContent);
    return skillPath;
  }

  async _installSkillDependencies(skillPath) {
    // Mock dependency installation - in production, this would install actual dependencies
    console.log(`Installing dependencies for skill at ${skillPath}`);
  }

  async _checkSkillInstalled(skillName) {
    try {
      const skillPath = path.join(this.skillsPath, 'installed', skillName);
      await fs.access(skillPath);
      return true;
    } catch {
      return false;
    }
  }

  async _removeSkill(skillName) {
    try {
      const skillPath = path.join(this.skillsPath, 'installed', skillName);
      await fs.rm(skillPath, { recursive: true, force: true });
    } catch (error) {
      console.error(`Error removing skill ${skillName}:`, error);
    }
  }
}

module.exports = new SkillsController();