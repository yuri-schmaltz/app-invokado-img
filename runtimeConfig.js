const DEFAULT_HOST = "0.0.0.0"
const DEFAULT_PORT = 9090

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "")

function getHost() {
  const preferredHost =
    normalizeString(process.env.PINOKIO_INVOKEAI_HOST) ||
    normalizeString(process.env.INVOKEAI_HOST)

  return preferredHost || DEFAULT_HOST
}

function getPort() {
  const preferredPort =
    normalizeString(process.env.PINOKIO_INVOKEAI_PORT) ||
    normalizeString(process.env.INVOKEAI_PORT) ||
    normalizeString(process.env.PORT)

  const parsed = Number.parseInt(preferredPort, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_PORT
}

function getWebArgs() {
  return (
    normalizeString(process.env.PINOKIO_INVOKEAI_ARGS) ||
    normalizeString(process.env.INVOKEAI_WEB_ARGS)
  )
}

function buildInvokeCommand(host, port, additionalArgs = "") {
  const baseCommand = `invokeai-web --host ${host} --port ${port}`
  return additionalArgs ? `${baseCommand} ${additionalArgs}` : baseCommand
}

function buildFallbackUrl(host, port) {
  const urlHost = host === "0.0.0.0" ? "127.0.0.1" : host
  return `http://${urlHost}:${port}`
}

module.exports = {
  DEFAULT_HOST,
  DEFAULT_PORT,
  getHost,
  getPort,
  getWebArgs,
  buildInvokeCommand,
  buildFallbackUrl,
}
