# Electron Resource Monitor

A real-time system resource monitoring application built with Electron, React, and TypeScript. This desktop application provides live monitoring of CPU, Memory, and Storage usage with an intuitive dark-themed interface.

## Features

- **Real-time Monitoring**: Live tracking of system resources with 1-second polling intervals
- **Multi-platform Support**: Works on Windows, macOS, and Linux
- **Dark Mode Interface**: Modern dark-themed UI for better visibility
- **Line Chart Visualization**: Clean line charts showing resource usage trends over time
- **Storage Optimization**: Intelligent storage polling (every 15 seconds) to reduce system load
- **Multi-drive Support**: On Windows, monitors all available drives (C:, D:, E:, etc.)

## Technology Stack

### Frontend

- **React 18** - UI framework with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library for data visualization
- **Lucide React** - Icon library
- **Vite** - Fast build tool and development server

### Backend

- **Electron** - Cross-platform desktop application framework
- **Node.js** - Runtime environment
- **os-utils** - System resource monitoring library
- **fs** - File system operations for storage monitoring

### Development Tools

- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking
- **Electron Builder** - Application packaging and distribution

## Project Structure

```
electron-learning/
├── src/
│   ├── electron/          # Electron main process
│   │   ├── main.ts        # Main process entry point
│   │   ├── resourceManage.ts  # Resource monitoring logic
│   │   └── preload.cts    # Preload script for IPC
│   └── ui/                # React frontend
│       ├── components/     # React components
│       ├── hooks/          # Custom React hooks
│       └── main.tsx        # React entry point
├── package.json           # Dependencies and scripts
└── electron.builder.json  # Electron builder configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd electron-learning
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Key Features Explained

### Resource Monitoring

- **CPU Usage**: Real-time CPU utilization percentage
- **Memory Usage**: Current memory consumption vs total available
- **Storage Usage**: Combined usage across all drives (Windows) or root filesystem (Unix)

### Chart Visualization

- **Line Charts**: Clean, non-stacked line charts for each resource
- **Time Series**: Shows resource usage over the last 10 data points
- **Real-time Updates**: Charts update every second for CPU/Memory, every 15 seconds for Storage

### Cross-platform Compatibility

- **Windows**: Monitors all available drives (A-Z)
- **Unix/Linux/macOS**: Monitors root filesystem
- **Error Handling**: Graceful handling of inaccessible drives

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Architecture

- **Main Process**: Handles system resource monitoring and IPC communication
- **Renderer Process**: React UI with real-time chart updates
- **Preload Script**: Secure bridge between main and renderer processes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
