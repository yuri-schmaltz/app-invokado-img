# Invoke Pinokio App Assessment

## Estrutura geral
- O repositório é composto por scripts Pinokio (`install.js`, `start.js`, `update.js`, `reset.js`, `pinokio.js`) responsáveis por instalar, iniciar e manter o ambiente InvokeAI.
- O novo módulo [`installCommands.js`](installCommands.js) centraliza os comandos de instalação por plataforma, reduzindo duplicação e facilitando futuras manutenções.
- Diretórios de dados (`models`, `outputs`, etc.) são compartilhados com o host via `fs.link`, permitindo persistência entre reinstalações.

## Coesão e integração
- `pinokio.js` coordena a experiência no Pinokio App, exibindo ações com base no estado de instalação ou execução.
- Os scripts passaram a compartilhar a mesma tabela de comandos de instalação, garantindo consistência entre `install.js` e `update.js`.
- O fluxo `install → start → proxy` mantém a aplicação exposta e com URL rastreada para a aba "Open Web UI".

## Robustez
- A criação explícita do diretório `app` e de suas subpastas corrige falhas ao inicializar o virtualenv e evita erros ao compartilhar pastas.
- O comando de update agora reutiliza o mesmo procedimento de instalação, eliminando `git pull` inválido em ambientes distribuídos via PyPI.
- O comando de inicialização força `--host 0.0.0.0`, garantindo acesso externo ao web UI em ambientes com proxy.
- Recomenda-se futura automação do `invokeai-configure` (modo não-interativo) para reduzir passos manuais após a instalação inicial.

## Otimização
- O reaproveitamento de comandos reduz divergências entre instalação e atualização, simplificando manutenção.
- A criação única dos diretórios evita chamadas redundantes do Pinokio para `fs.link` que antes falhavam por ausência de destino.
- Sugestão futura: cachear dependências Python no host (ex.: `pip download`) para acelerar reinstalações em ambientes com rede limitada.

## Documentação
- A documentação do fluxo Pinokio é mínima; recomenda-se adicionar um guia de uso completo (instalação, configuração e troubleshooting) no futuro.
- As instruções de linkagem de pastas foram preservadas para indicar onde ficam dados importantes (`outputs`, `models`).

## Melhorias implementadas
- Criação automática das pastas compartilhadas antes da instalação.
- Atualização passou a executar `pip install --upgrade`, mantendo o aplicativo alinhado ao PyPI.
- Parâmetros de rede do `invokeai-web` ajustados para ambientes remotos.

## Próximos passos sugeridos
1. Automatizar `invokeai-configure` com parâmetros `--yes`/`--default-only` assim que a CLI oferecer modo não interativo estável.
2. Validar a presença de GPU compatível e informar requisitos mínimos antes da instalação.
3. Expor logs estruturados (ex.: salvar stdout em arquivos dentro de `app/logs`) para facilitar suporte.
4. Criar um guia de troubleshooting abordando problemas comuns (drivers, dependências opcionais, permissões em diretórios compartilhados).
