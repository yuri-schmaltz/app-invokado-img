const path = require('path')

const {
  getHost,
  getPort,
  getWebArgs,
  buildInvokeCommand,
  buildFallbackUrl,
} = require('./runtimeConfig')

const pythonPath = path.resolve(__dirname, 'python')
const combinedPythonPath = process.env.PYTHONPATH
  ? `${pythonPath}${path.delimiter}${process.env.PYTHONPATH}`
  : pythonPath

const host = getHost()
const port = getPort()
const additionalArgs = getWebArgs()
const invokeCommand = buildInvokeCommand(host, port, additionalArgs)
const fallbackUrl = buildFallbackUrl(host, port)

module.exports = {
  daemon: true,
  run: [
    // Edit this step to customize your app's launch command
    {
      method: "shell.run",
      params: {
        venv: "env",                // Edit this to customize the venv folder path
        env: {
          PYTHONPATH: combinedPythonPath,
          INVOKEAI_HOST: host,
          INVOKEAI_PORT: String(port),
          INVOKEAI_WEB_ARGS: additionalArgs,
        },                   // Edit this to customize environment variables (see documentation)
        path: "app",
        message: [
          invokeCommand,
        ],
        on: [{
          // The regular expression pattern to monitor.
          // When this pattern occurs in the shell terminal, the shell will return,
          // and the script will go onto the next step.
          "event": "/http:\/\/\\S+/",

          // "done": true will move to the next step while keeping the shell alive.
          // "kill": true will move to the next step after killing the shell.
          "done": true
        }],

        // Ensure the flow advances even if InvokeAI does not print a URL.
        timeout: 15000
      }
    },
    // This step sets the local variable 'url'.
    // This local variable will be used in pinokio.js to display the "Open WebUI" tab when the value is set.
    {
      method: "local.set",
      params: {
        // the input.event is the regular expression match object from the previous step
        url: `{{(input.event && input.event[0]) || '${fallbackUrl}'}}`
      }
    },
    {
      method: "proxy.start",
      params: {
        uri: "{{local.url}}",
        name: "Local Sharing"
      }
    }
  ]
}

