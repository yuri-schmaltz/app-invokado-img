const INSTALL_COMMANDS = {
  win32: {
    nvidia: "pip install \"InvokeAI[xformers]\" --upgrade --use-pep517 --extra-index-url https://download.pytorch.org/whl/cu124",
    amd: "pip install InvokeAI --upgrade --use-pep517 --extra-index-url https://download.pytorch.org/whl/cpu && pip install torch-directml --upgrade",
    cpu: "pip install InvokeAI --upgrade --use-pep517 --extra-index-url https://download.pytorch.org/whl/cpu"
  },
  linux: {
    nvidia: "pip install \"InvokeAI[xformers]\" --upgrade --use-pep517 --extra-index-url https://download.pytorch.org/whl/cu124",
    amd: "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.1 && pip install InvokeAI --upgrade --use-pep517",
    cpu: "pip install InvokeAI --upgrade --use-pep517 --extra-index-url https://download.pytorch.org/whl/cpu"
  },
  darwin: "pip install InvokeAI --upgrade --use-pep517"
}

const INSTALL_COMMAND_TEMPLATE = "{{(platform === 'darwin' ? self.cmds.darwin : (['nvidia', 'amd'].includes(gpu) ? self.cmds[platform][gpu] : self.cmds[platform].cpu))}}"

module.exports = { INSTALL_COMMANDS, INSTALL_COMMAND_TEMPLATE }
