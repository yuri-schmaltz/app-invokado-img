const { INSTALL_COMMANDS, INSTALL_COMMAND_TEMPLATE } = require('./installCommands')

const CREATE_APP_DIRECTORY_COMMAND = "node -e \"const fs = require('fs'); fs.mkdirSync('app', { recursive: true });\""

module.exports = {
  cmds: INSTALL_COMMANDS,
  run: [{
    method: "shell.run",
    params: {
      message: [
        CREATE_APP_DIRECTORY_COMMAND,
      ]
    }
  }, {
    method: "shell.run",
    params: {
      venv: "env",
      path: "app",
      message: [
        INSTALL_COMMAND_TEMPLATE,
      ]
    }
  }, {
    method: "notify",
    params: {
      html: "Update complete. Restart the service from the Start tab. Adjust PINOKIO_INVOKEAI_HOST/PINOKIO_INVOKEAI_PORT before starting if you need a different endpoint."
    }
  }]
}
