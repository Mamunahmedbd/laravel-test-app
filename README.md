# Interactive Mind Map Application

A modern, interactive mind mapping application built with Laravel and React, featuring a dynamic and visually appealing interface for creating and viewing mind maps.

![Mind Map Preview](image.png)

_Preview: UI/UX Design Principles Mind Map with color-coded sections and dotted line connections_

## Features

- **Interactive Mind Map Visualization**

    - Smooth, animated connections between nodes
    - Dotted line connections with color inheritance from parent nodes
    - Customizable node colors for different sections
    - Responsive node sizing based on content

- **Node Styling**

    - Main section nodes with distinct colors:
        - Basic Principles (Green)
        - Key Components (Orange)
        - Applications (Blue)
    - Child nodes inherit connection colors from parents
    - Automatic text color adjustment based on background brightness
    - Shadow effects and hover animations

- **Navigation & Controls**

    - Zoom in/out functionality
    - Interactive minimap for easy navigation
    - Draggable nodes and connections
    - Background grid for better visual orientation

- **User Interface**
    - Clean, modern design
    - Responsive layout
    - Loading states for better user experience
    - Smooth animations and transitions

## Technical Stack

- **Backend**

    - Laravel (PHP Framework)
    - Postgres Database

- **Frontend**
    - React
    - TypeScript
    - @xyflow/react (React Flow)
    - Tailwind CSS

## Getting Started

### Prerequisites

- PHP >= 8.1
- Node.js >= 16
- Composer
- Postgres

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2. Install PHP dependencies:

    ```bash
    composer install
    ```

3. Install JavaScript dependencies:

    ```bash
    npm install
    ```

4. Copy the environment file:

    ```bash
    cp .env.example .env
    ```

5. Generate application key:

    ```bash
    php artisan key:generate
    ```

6. Configure your database in `.env` file:

    ```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
    ```

7. Run migrations:
    ```bash
    php artisan migrate
    ```

### Development

1. Start the Laravel development server:

    ```bash
    php artisan serve
    ```

2. Start the Vite development server:
    ```bash
    npm run dev
    ```

## Usage

The mind map application allows you to:

- Create hierarchical mind maps with multiple levels
- Customize node colors and styles
- Add descriptions to nodes
- Navigate through the mind map using pan and zoom
- View an overview of the entire map using the minimap

## Component Structure

### MindMapViewer

- Main component for rendering the mind map
- Handles node and edge state management
- Processes color inheritance and styling
- Manages user interactions and layout

### CustomNode

- Renders individual nodes
- Handles node styling and appearance
- Manages connection points (handles)
- Implements color and opacity effects

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React Flow](https://reactflow.dev/) for the flow visualization library
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Laravel](https://laravel.com/) for the backend framework
