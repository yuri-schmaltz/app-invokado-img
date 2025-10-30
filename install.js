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

module.exports = {
  cmds: INSTALL_COMMANDS,
  run: [{
    method: "shell.run",
    params: {
      message: [
        "mkdir -p app",
        `mkdir -p ${SHARED_DIRECTORIES.map((dir) => `app/${dir}`).join(' ')}`,
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
