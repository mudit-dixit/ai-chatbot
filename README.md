# Data Visualization Application

A modern web application for fetching, visualizing, and analyzing data using MST-gql, Express.js, and Dgraph database. The application provides interactive data visualization with powerful sorting and filtering capabilities.

## Features

- Real-time data visualization using interactive charts and graphs
- Advanced filtering capabilities for data exploration
- Customizable sorting options for better data analysis
- Responsive design that works across all devices
- Built with modern technologies for optimal performance

## Tech Stack

### Frontend
- React.js for UI components
- MST-gql for state management and GraphQL integration
- D3.js/Chart.js for data visualization
- Tailwind CSS for styling

### Backend
- Express.js server
- Dgraph database for efficient graph data storage
- GraphQL API for data fetching

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14.0.0 or higher)
- npm or yarn package manager
- Dgraph database (v21.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/data-visualization-app.git
cd data-visualization-app
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Configure environment variables:
```bash
# In the server directory
cp .env.example .env
```

Edit the `.env` file with your configuration:
```
DGRAPH_URL=your_dgraph_url
PORT=3000
```

## Running the Application

1. Start the Dgraph database:
```bash
dgraph zero
dgraph alpha
```

2. Start the backend server:
```bash
cd server
npm run dev
```

3. Start the frontend application:
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`

## Data Management

### Filtering Options
- Date range filtering
- Category-based filtering
- Text search functionality
- Numerical range filters

### Sorting Capabilities
- Multi-level sorting
- Ascending/descending options
- Sort by any data field
- Custom sort functions

## API Documentation

### GraphQL Queries

Example query for fetching data:
```graphql
query GetData($filter: FilterInput, $sort: SortInput) {
  getData(filter: $filter, sort: $sort) {
    id
    timestamp
    value
    category
  }
}
```

### Filter Parameters
- `dateRange`: Start and end date
- `categories`: Array of categories to include
- `searchTerm`: Text search string
- `valueRange`: Min and max values

### Sort Parameters
- `field`: Field to sort by
- `order`: ASC or DESC
- `priority`: Sort priority for multi-level sorting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team at support@example.com.

## Acknowledgements

- MST-gql team for the excellent state management solution
- Dgraph team for the powerful graph database
- Express.js community for the robust backend framework