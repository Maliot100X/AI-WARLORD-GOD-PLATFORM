const { Octokit } = require('@octokit/rest');

class GitHubController {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  }

  async analyzeRepo(req, res) {
    try {
      const { owner, repo } = req.body;
      
      // Get repository information
      const { data: repoData } = await this.octokit.repos.get({
        owner,
        repo
      });

      // Get repository issues
      const { data: issues } = await this.octokit.issues.listForRepo({
        owner,
        repo,
        state: 'open'
      });

      // Get repository pull requests
      const { data: prs } = await this.octokit.pulls.list({
        owner,
        repo,
        state: 'open'
      });

      // Analyze code quality (simplified)
      const analysis = {
        repo: repoData,
        issues: {
          total: issues.length,
          bugs: issues.filter(issue => issue.labels.some(label => label.name === 'bug')).length,
          features: issues.filter(issue => issue.labels.some(label => label.name === 'enhancement')).length
        },
        pullRequests: {
          total: prs.length,
          pending: prs.length
        },
        recommendations: this._generateRecommendations(repoData, issues, prs)
      };

      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async createPR(req, res) {
    try {
      const { owner, repo, title, body, head, base } = req.body;
      
      const { data: pr } = await this.octokit.pulls.create({
        owner,
        repo,
        title,
        body,
        head,
        base
      });

      res.json({
        success: true,
        data: pr
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async createIssue(req, res) {
    try {
      const { owner, repo, title, body, labels } = req.body;
      
      const { data: issue } = await this.octokit.issues.create({
        owner,
        repo,
        title,
        body,
        labels: labels || []
      });

      res.json({
        success: true,
        data: issue
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getRepoStatus(req, res) {
    try {
      const { owner, repo } = req.params;
      
      const { data: repoData } = await this.octokit.repos.get({
        owner,
        repo
      });

      const { data: branches } = await this.octokit.repos.listBranches({
        owner,
        repo
      });

      const { data: contributors } = await this.octokit.repos.listContributors({
        owner,
        repo
      });

      res.json({
        success: true,
        data: {
          repository: repoData,
          branches: branches.length,
          contributors: contributors.length,
          lastUpdated: repoData.updated_at
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  _generateRecommendations(repoData, issues, prs) {
    const recommendations = [];

    if (issues.length > 10) {
      recommendations.push('Consider addressing open issues to improve code quality');
    }

    if (prs.length > 5) {
      recommendations.push('Review and merge pending pull requests');
    }

    if (repoData.open_issues_count > repoData.stargazers_count / 2) {
      recommendations.push('Issue to star ratio is high - focus on resolving issues');
    }

    return recommendations;
  }
}

module.exports = new GitHubController();