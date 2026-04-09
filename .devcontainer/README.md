# Dev Container for MonoFocus

This dev container provides a consistent development environment with Node.js pre-installed.

## Features

- **Node.js 22 LTS** (Bookworm-based Debian)
- **Git** for version control
- **GitHub CLI** for GitHub operations
- Pre-configured VS Code extensions for JavaScript/TypeScript development

## Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [VS Code](https://code.visualstudio.com/)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Usage

1. Open the project in VS Code
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. Select **"Dev Containers: Reopen in Container"**
4. Wait for the container to build (first time only)

VS Code will automatically:
- Build the dev container
- Install Node.js and dependencies
- Configure extensions and settings
- Open your workspace inside the container

## Ports

The following ports are forwarded from the container to your host:
- `3000` - Common dev server port (React, Next.js)
- `5173` - Vite dev server
- `8080` - Alternative web server

## Customization

Edit `.devcontainer/devcontainer.json` to:
- Add more VS Code extensions
- Change Node.js version
- Add additional tools
- Modify port forwarding
- Customize container settings

## Node Version

To use a different Node.js version, modify the `image` field in `devcontainer.json`:

```json
"image": "mcr.microsoft.com/devcontainers/javascript-node:1-20-bookworm"
```

Available versions: 18, 20, 22 (LTS versions)
