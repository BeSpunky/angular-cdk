# ARG values defined in devcontainer.json
ARG NODE_VARIANT
ARG PNPM_VERSION
ARG NX_CLI_VERSION

# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.209.6/containers/typescript-node/.devcontainer/base.Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${NODE_VARIANT} as environment

# Install pnpm globally to allow running `pnpm` and `pnpx` commands (installing packages, etc.) from the container's terminal
RUN npm install -g pnpm@${PNPM_VERSION}
# Install nx CLI globally to allow running `nx` commands from the container's terminal
RUN pnpm install -g @nrwl/cli@${NX_CLI_VERSION}
