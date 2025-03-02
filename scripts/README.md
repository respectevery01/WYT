# Google Analytics Integration

This directory contains scripts for automatically adding Google Analytics tracking code to all HTML files in the project.

## How It Works

The `add-analytics.js` script automatically adds Google Analytics tracking code to all HTML files in your project. The script:

1. Recursively searches for all `.html` files in the project directory
2. Checks if the Google Analytics tracking code is already present
3. If not, adds the tracking code just before the `</head>` tag
4. Reports which files were updated

## Usage

### Manual Usage

To manually add Google Analytics tracking code to all HTML files:

```bash
npm run analytics
```

### Automatic Usage

The Google Analytics tracking code is automatically added in the following scenarios:

1. When starting the server: `npm start`
2. Before building the project (if applicable): `npm run build`
3. When creating or modifying any HTML file in the `public` directory

## Tracking ID

The current tracking ID is `G-F63N2FG7KY`. If you need to change this ID:

1. Edit the `analyticsCode` variable in `scripts/add-analytics.js`
2. Run the script again to update all HTML files

## Troubleshooting

If you encounter any issues:

1. Ensure the script has the necessary permissions to modify files
2. Check that your HTML files have a proper `<head>` section
3. Run the script manually with `npm run analytics` to see detailed output

For more information about Google Analytics, visit: https://analytics.google.com/ 