# Electron Resource Monitor

A real-time system resource monitoring application built with Electron, React, and TypeScript. This desktop application provides live monitoring of CPU, Memory, and Storage usage with an intuitive dark-themed interface and line chart visualization.

## 🔒 Security & Safety

**This application is designed for learning Electron development and is completely safe to use:**

- **No malicious code**: This is an open-source learning project with no harmful functionality
- **Local-only operation**: All data processing happens locally on your machine
- **No data collection**: The app does not collect, store, or transmit any personal data
- **Read-only access**: Only reads system resource information, never modifies files or settings
- **Transparent code**: All source code is visible and can be reviewed
- **Educational purpose**: Built specifically for learning Electron development concepts

The app only accesses system resource information (CPU, memory, storage usage) for display purposes and does not perform any system modifications or data collection.

## Features

- **Real-time Monitoring**: Live tracking of system resources with 1-second polling intervals
- **Multi-platform Support**: Works on Windows, macOS, and Linux
- **Dark Mode Interface**: Modern dark-themed UI for better visibility
- **Line Chart Visualization**: Clean line charts showing resource usage trends over time with percentage display
- **Custom Tooltips**: Enhanced tooltips with percentage symbols and wider display
- **Storage Optimization**: Intelligent storage polling (every 15 seconds) to reduce system load
- **Multi-drive Support**: On Windows, monitors all available drives (C:, D:, E:, etc.)
- **System Tray**: Custom tray menu with styled context menu
- **Fullscreen Support**: Proper fullscreen handling with macOS compatibility

## Technology Stack

### Frontend

- **React 18** - UI framework with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library for data visualization with custom tooltips
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
│   │   ├── tray.ts        # System tray implementation
│   │   ├── menu.ts        # Application menu with fullscreen handling
│   │   └── preload.cts    # Preload script for IPC
│   └── ui/                # React frontend
│       ├── components/     # React components
│       │   └── chart-line-multiple.tsx  # Line chart with custom tooltips
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

- **CPU Usage**: Real-time CPU utilization percentage (0-100%)
- **Memory Usage**: Current memory consumption vs total available (0-100%)
- **Storage Usage**: Combined usage across all drives (Windows) or root filesystem (Unix) (0-100%)

### Chart Visualization

- **Line Charts**: Clean, non-stacked line charts for each resource
- **Percentage Display**: All values shown as percentages (e.g., "45.2%")
- **Custom Tooltips**: Enhanced tooltips with percentage symbols and wider display
- **Time Series**: Shows resource usage over the last 10 data points
- **Real-time Updates**: Charts update every second for CPU/Memory, every 15 seconds for Storage

### Cross-platform Compatibility

- **Windows**: Monitors all available drives (A-Z)
- **Unix/Linux/macOS**: Monitors root filesystem
- **Error Handling**: Graceful handling of inaccessible drives
- **macOS Fullscreen**: Proper async fullscreen transition handling

### System Integration

- **Custom Tray Menu**: Styled HTML tray menu with proper security
- **Fullscreen Handling**: Fixed macOS async fullscreen transitions
- **Menu Enhancements**: Added hide/show options and keyboard shortcuts

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Testing

- **Unit Tests**: Vitest for testing individual components and functions
- **E2E Tests**: Playwright for testing full application workflows including fullscreen toggling and tab navigation
- **Test Coverage**: Covers tray menu functionality, fullscreen commands (F11/Escape), and UI interactions

### Architecture

- **Main Process**: Handles system resource monitoring and IPC communication
- **Renderer Process**: React UI with real-time chart updates
- **Preload Script**: Secure bridge between main and renderer processes
- **Tray Process**: Custom HTML tray menu with secure IPC

## Recent Updates

### Chart Improvements

- **Line Charts**: Replaced area charts with cleaner line visualization
- **Percentage Display**: All values now show as percentages
- **Custom Tooltips**: Enhanced tooltips with percentage symbols and wider width
- **Color Scheme**: Updated to light blue/cyan color palette

### System Integration

- **Custom Tray Menu**: Styled HTML tray menu with proper security
- **Fullscreen Handling**: Fixed macOS async fullscreen transitions
- **Menu Enhancements**: Added hide/show options and keyboard shortcuts

### Performance Optimizations

- **Storage Polling**: Reduced frequency to 15 seconds for stable display
- **Data Points**: Increased to 25 points for better visualization
- **Time Formatting**: Improved time display with proper formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
