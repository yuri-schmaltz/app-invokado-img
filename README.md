# Guia da Aplicação Invoke para Pinokio

## Visão geral
Esta aplicação integra o web UI oficial do [InvokeAI](https://github.com/invoke-ai/InvokeAI) ao ecossistema do Pinokio, oferecendo fluxos automatizados para instalar dependências, iniciar o servidor e expor a interface no navegador. O menu dinâmico do Pinokio identifica se o ambiente já foi instalado ou está em execução para exibir as ações apropriadas, como instalar, iniciar, abrir o Web UI, atualizar ou redefinir a configuração local.【F:pinokio.js†L1-L48】

## Estrutura de arquivos
- `install.js`: cria a pasta `app`, prepara diretórios compartilhados (modelos, saídas etc.) e executa o `pip install` apropriado para o sistema operacional e GPU detectados.【F:install.js†L1-L41】
- `installCommands.js`: concentra os comandos de instalação para Windows, Linux e macOS, diferenciando configurações NVIDIA, AMD e CPU.【F:installCommands.js†L1-L20】
- `start.js`: inicia o `invokeai-web` dentro do ambiente virtual Python, define variáveis de ambiente, captura a URL da interface e ativa o compartilhamento local via proxy.【F:start.js†L1-L65】
- `update.js`: executa um `pip install --upgrade` com os mesmos comandos da instalação inicial e preserva os dados existentes.【F:update.js†L1-L30】
- `reset.js`: remove somente o ambiente virtual (`app/env`) para forçar uma reinstalação limpa sem apagar seus modelos e saídas.【F:reset.js†L1-L8】
- `python/sitecustomize.py`: garante compatibilidade com `typing.Self` em execuções com Python < 3.11, sendo carregado automaticamente ao iniciar a aplicação.【F:python/sitecustomize.py†L1-L15】

Os diretórios `models`, `outputs`, `nodes`, entre outros, são mantidos fora do ambiente virtual e ligados ao host via `fs.link`, o que permite reutilizar os mesmos dados em reinstalações futuras.【F:install.js†L5-L33】

## Pré-requisitos
1. **Pinokio instalado** e configurado no seu sistema.
2. **Python 3.10+** disponível para criar o ambiente virtual interno (o Pinokio cuida da criação do venv `app/env`).
3. **Drivers atualizados** para a GPU correspondente ao comando selecionado automaticamente (CUDA para NVIDIA, ROCm para AMD, DirectML no Windows quando aplicável). Caso nenhuma GPU compatível seja identificada, o fluxo utiliza o modo CPU.【F:installCommands.js†L1-L18】

## Fluxo de instalação
1. Abra o Pinokio e escolha a aplicação "Invoke".
2. Clique em **Install**. O Pinokio irá:
   - Criar a pasta `app` e subdiretórios compartilhados (`models`, `outputs`, `databases`, `autoimport`, `nodes`, `text-inversion-*`).【F:install.js†L5-L27】
   - Executar o comando `pip install` adequado ao seu sistema utilizando o ambiente virtual `app/env`.【F:install.js†L20-L33】【F:installCommands.js†L1-L20】
   - Criar links simbólicos para que os diretórios de dados permaneçam persistentes fora do ambiente virtual.【F:install.js†L29-L37】
   - Exibir uma notificação informando que você pode iniciar o serviço a partir da aba "Start".【F:install.js†L37-L41】

> **Dica:** após a primeira instalação, execute o utilitário `invokeai-configure` dentro do terminal da aba **Start** se quiser personalizar modelos pré-carregados ou caminhos padrão (passo ainda manual).

## Inicialização e acesso ao Web UI
1. Abra a aba **Start** e clique em **Start** para executar o servidor.
2. O script `start.js` define o `PYTHONPATH` para incluir a pasta `python/`, injeta variáveis de ambiente no processo (`INVOKEAI_HOST`, `INVOKEAI_PORT`, `INVOKEAI_WEB_ARGS`) e roda o comando `invokeai-web` com host e porta definidos.【F:start.js†L11-L38】
3. Assim que o terminal imprimir a URL completa (`http://<host>:<porta>`), ela é armazenada para que o botão **Open Web UI** apareça automaticamente no menu do Pinokio.【F:start.js†L34-L60】
4. Um proxy de compartilhamento local é iniciado, permitindo abrir o InvokeAI diretamente do Pinokio ou copiar o link compartilhável.【F:start.js†L61-L65】

### Configurando host, porta e parâmetros adicionais
Use variáveis de ambiente antes de iniciar o serviço:
- `PINOKIO_INVOKEAI_HOST` ou `INVOKEAI_HOST` para alterar o host (padrão `0.0.0.0`).【F:runtimeConfig.js†L1-L38】
- `PINOKIO_INVOKEAI_PORT`, `INVOKEAI_PORT` ou `PORT` para escolher a porta (padrão `9090`).【F:runtimeConfig.js†L9-L23】
- `PINOKIO_INVOKEAI_ARGS` ou `INVOKEAI_WEB_ARGS` para anexar argumentos extras ao `invokeai-web` (por exemplo, `--root-path /invoke`).【F:runtimeConfig.js†L25-L35】

Caso nenhuma URL seja detectada automaticamente, o Pinokio utiliza `http://127.0.0.1:<porta>` como fallback para o botão **Open Web UI**.【F:runtimeConfig.js†L37-L45】【F:start.js†L48-L60】

## Atualizações
Selecione a aba **Update** para atualizar o InvokeAI para a versão mais recente disponível no PyPI. O fluxo recria a pasta `app` se necessário e repete o mesmo comando de instalação com `--upgrade`, mantendo seus modelos e saídas intactos.【F:update.js†L1-L30】

## Redefinição do ambiente virtual
Se o ambiente virtual corromper ou você desejar reinstalar dependências do zero, use a aba **Reset**. Ela remove apenas `app/env`, preservando dados compartilhados e arquivos de configuração personalizados que você manteve fora do venv.【F:reset.js†L1-L8】【F:install.js†L29-L37】

## Personalizações avançadas
- **Extensões Python:** adicione módulos próprios dentro de `python/` para que sejam carregados automaticamente graças ao ajuste em `PYTHONPATH` e ao `sitecustomize.py` incluído.【F:start.js†L11-L24】【F:python/sitecustomize.py†L1-L15】
- **Argumentos extras do InvokeAI:** utilize `PINOKIO_INVOKEAI_ARGS` para ativar recursos como autenticação, caminhos customizados de saída ou integração com pipelines externas.【F:runtimeConfig.js†L25-L35】
- **Persistência de dados:** arquivos gerados nas pastas compartilhadas (por exemplo, `outputs/` e `models/`) permanecem mesmo após reinstalar ou atualizar o aplicativo, permitindo migração fácil entre máquinas via Pinokio Drive.【F:install.js†L5-L37】

## Solução de problemas
1. **Servidor não inicia ou porta ocupada:** ajuste `PINOKIO_INVOKEAI_PORT` para um valor livre antes de clicar em Start.【F:runtimeConfig.js†L9-L23】
2. **Interface inacessível externamente:** mantenha o host em `0.0.0.0` e utilize o botão **Open Web UI** (que respeita a URL detectada ou o fallback `127.0.0.1`).【F:runtimeConfig.js†L1-L7】【F:runtimeConfig.js†L37-L45】【F:start.js†L48-L60】
3. **Instalação lenta ou falha de dependências GPU:** confirme os drivers e bibliotecas correspondentes (CUDA, ROCm ou DirectML). Se o hardware não for compatível, force a execução em modo CPU e considere limitar a geração para resoluções menores.【F:installCommands.js†L1-L18】

Com estes passos, você possui um guia completo para instalar, configurar, executar e manter o InvokeAI através do Pinokio, aproveitando os fluxos automatizados fornecidos pelo repositório.
