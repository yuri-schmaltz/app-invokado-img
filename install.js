const { INSTALL_COMMANDS, INSTALL_COMMAND_TEMPLATE } = require('./installCommands')

const SHARED_DIRECTORIES = [
  "models",
  "databases",
  "autoimport",
  "outputs",
  "nodes",
  "text-inversion-output",
  "text-inversion-training-data",
]

const DIRECTORIES_TO_CREATE = [
  "app",
  ...SHARED_DIRECTORIES.map((dir) => `app/${dir}`),
]

const DIRECTORIES_LITERAL = JSON.stringify(DIRECTORIES_TO_CREATE)
const ESCAPED_DIRECTORIES_LITERAL = DIRECTORIES_LITERAL.replace(/"/g, '\\"')
const CREATE_DIRECTORIES_COMMAND = `node -e "const fs = require('fs'); const dirs = ${ESCAPED_DIRECTORIES_LITERAL}; dirs.forEach((dir) => fs.mkdirSync(dir, { recursive: true }));"`

module.exports = {
  cmds: INSTALL_COMMANDS,
  run: [{
    method: "shell.run",
    params: {
      message: [
        CREATE_DIRECTORIES_COMMAND,
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
    method: "fs.link",
    params: {
      drive: SHARED_DIRECTORIES.reduce((links, dir) => {
        links[dir] = `app/${dir}`
        return links
      }, {})
    }
  }, {
    method: "notify",
    params: {
      html: "Installation complete. Use 'start' to launch the web UI. Set PINOKIO_INVOKEAI_HOST/PINOKIO_INVOKEAI_PORT to customize the endpoint before starting."
    }
  }]
}
