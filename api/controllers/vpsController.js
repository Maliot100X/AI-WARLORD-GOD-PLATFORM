const { NodeSSH } = require('node-ssh');

class VPSController {
  constructor() {
    this.ssh = new NodeSSH();
  }

  async deployToVPS(req, res) {
    try {
      const { host, username, password, command, script } = req.body;
      
      // Connect to VPS
      await this.ssh.connect({
        host,
        username,
        password
      });

      let result;
      if (script) {
        // Execute script
        result = await this.ssh.execCommand(script, { cwd: '/tmp' });
      } else {
        // Execute single command
        result = await this.ssh.execCommand(command);
      }

      // Disconnect
      this.ssh.dispose();

      res.json({
        success: true,
        data: {
          stdout: result.stdout,
          stderr: result.stderr,
          code: result.code
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getVPSStatus(req, res) {
    try {
      const { vpsId } = req.params;
      
      // Mock VPS status - in production, this would query actual VPS
      res.json({
        success: true,
        data: {
          id: vpsId,
          status: 'running',
          cpu: 45.2,
          memory: 67.8,
          disk: 34.5,
          uptime: '15 days, 3 hours',
          lastUpdate: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getVPSList(req, res) {
    try {
      // Mock VPS list - in production, this would query actual VPS provider
      res.json({
        success: true,
        data: [
          {
            id: 'vps-1',
            name: 'US-East-1',
            location: 'New York',
            status: 'running',
            ip: '192.168.1.100'
          },
          {
            id: 'vps-2',
            name: 'EU-West-1',
            location: 'Frankfurt',
            status: 'running',
            ip: '192.168.1.101'
          },
          {
            id: 'vps-3',
            name: 'Asia-Pacific-1',
            location: 'Tokyo',
            status: 'stopped',
            ip: '192.168.1.102'
          }
        ]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteVPS(req, res) {
    try {
      const { vpsId } = req.params;
      
      // Mock VPS deletion - in production, this would call actual VPS provider API
      res.json({
        success: true,
        message: `VPS ${vpsId} deleted successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new VPSController();