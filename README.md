# Terminal-Style Personal Homepage

This is a personal homepage website that simulates a terminal interface, built with Node.js and Express. The website has the following features:

- Typewriter animation effect when entering the site
- Terminal window layout, simulating a real command-line experience
- Support for various commands, including displaying personal information, links, and hash values
- Article management system for adding and reading Markdown articles
- Command history feature, allowing browsing through previous commands using arrow keys
- Right-click paste and Ctrl+V/Cmd+V shortcut for pasting
- Footer displaying personal contact information
- Responsive design, adapting to different device screens

## Installation

1. Make sure you have Node.js installed (version 14.0.0 or higher recommended)
2. Clone or download this repository
3. Run the following command in the project root directory to install dependencies:

```bash
npm install
```

## Usage

1. Start the development server:

```bash
npm run dev
```

2. Visit in your browser: `http://localhost:3000/main.html`

## Available Commands

In the terminal interface, you can use the following commands:

- `help` - Display all available commands
- `cat bio.txt` - Display personal information
- `ls -la links` - List all personal links
- `openssl sha256` - Show cryptographic hash values
- `clear` - Clear terminal content
- `exit` - Return to the welcome screen
- `git push` - Go to the personal homepage

## Article Management Feature

### Creating a New Article

In the actual terminal (not the web terminal), run:

```bash
npm run article "Your Article Title"
```

This will create a new Markdown format article file in the `articles` directory.

### Viewing Article List

In the web terminal, enter:

```
docs ls
```

This will display a list of all articles you've created.

### Reading Articles

After seeing the article list, enter the number in front of the article (1-5) to read the corresponding article.

### Browsing More Articles

If you have more than 5 articles, you can use the following commands to browse more:

```
next      # Show next page of articles
prev      # Show previous page of articles
```

### Managing Articles in the Actual Terminal

```bash
npm run docs ls         # List all articles
npm run docs view 1     # View article #1
npm run docs next       # Next page
npm run docs prev       # Previous page
```

## Convenience Features

- **Command History**: Use the up and down arrow keys to browse through previously entered commands
- **Paste Function**: Right-click on the terminal or use Ctrl+V/Cmd+V shortcut to paste text
- **Auto-scroll**: The terminal automatically scrolls to the bottom after entering commands

## Customizing Content

You can customize the website content by editing the following files:

- `public/main.html` - Modify the terminal interface and JavaScript code
- `articles/` - Store all Markdown format articles

## Deployment

To deploy to a production environment, you can use the following command:

```bash
npm start
```

Then deploy the application to your preferred hosting service, such as Heroku, Vercel, Netlify, etc.

## Technology Stack

- Node.js
- Express
- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage (for storing command history)
- Markdown (for article formatting)

## License

MIT 