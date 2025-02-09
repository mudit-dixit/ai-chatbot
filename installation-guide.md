# Installation Guide

This guide will walk you through setting up the complete application stack using Docker and initializing it with sample data.

## Prerequisites
- Git installed on your system
- Internet connection
- Terminal/Command Prompt access

## Step 1: Install Docker
1. Download Docker Desktop from the official website:
   - For Windows: https://www.docker.com/products/docker-desktop
   - For Mac: https://www.docker.com/products/docker-desktop
   - For Linux: Follow distribution-specific instructions at https://docs.docker.com/engine/install/

2. Install Docker Desktop following the installer instructions
3. Verify installation by opening a terminal and running:
```bash
docker --version
docker-compose --version
```

## Step 2: Clone and Start Docker Services
1. Clone the repository:
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

2. Navigate to the Docker folder:
```bash
cd docker
```

3. Start the Docker containers:
```bash
docker-compose up -d
```

4. Verify containers are running:
```bash
docker ps
```
You should see containers for:
- Dgraph Zero
- Dgraph Alpha
- Ratel (Dgraph's UI client)

## Step 3: Upload GraphQL Schema
1. Wait approximately 30 seconds for Dgraph to fully initialize

2. Upload the schema using curl:
```bash
curl -X POST localhost:8080/admin/schema --data-binary '@schema.graphql'
```

3. Verify the response shows success (you should see a JSON response indicating successful schema upload)

## Step 4: Generate and Load Sample Data
1. Navigate to the scripts directory:
```bash
cd ../scripts
```

2. Run the sales data generation script:
```bash
node sales.js
```
This will generate a GraphQL mutation query in the console.

3. Open Ratel client in your browser:
```
http://localhost:8000
```

4. In Ratel:
   - Click "Continue" to connect to the default Dgraph instance
   - Navigate to the "Console" tab
   - Paste the GraphQL mutation generated from sales.js
   - Click "Run" to execute the mutation
   - Verify the response shows successful data creation

## Step 5: Start the Backend Server
1. Navigate to the server directory:
```bash
cd ../server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```
The server should start on port 3000 (or your configured port)

## Step 6: Start the Frontend Application
1. Open a new terminal window

2. Navigate to the frontend directory:
```bash
cd path/to/your-repo-name/client
```

3. Install dependencies:
```bash
npm install
```

4. Start the React application:
```bash
npm start
```
The application should automatically open in your default browser at http://localhost:3001

## Verification Steps
1. Check that all services are running:
   - Docker containers (dgraph-zero, dgraph-alpha, ratel)
   - Backend server (Express.js)
   - Frontend application (React)

2. Verify data access:
   - Open the React application
   - Check if the sales data is displayed
   - Try sorting and filtering functions

## Troubleshooting
If you encounter issues:

1. Docker containers not starting:
```bash
docker-compose down
docker-compose up -d
```

2. Schema upload fails:
- Ensure Dgraph is fully initialized (wait 30-60 seconds after container start)
- Check if the schema.graphql file is in the correct location
- Verify the schema syntax

3. Data generation issues:
- Check Node.js version (should be 14+)
- Verify all dependencies are installed
- Check console for specific error messages

4. Server connection issues:
- Verify all required environment variables are set
- Check if the ports are not in use by other applications
- Look for errors in the server console

## Next Steps
After successful installation:
1. Explore the Ratel UI to understand your data structure
2. Review the API documentation for available queries
3. Test the filtering and sorting capabilities
4. Start building your custom visualizations

## Support
If you encounter any issues not covered in the troubleshooting section, please:
1. Check the logs of the specific component having issues
2. Refer to the project documentation
3. Open an issue in the project repository
4. Contact the development team