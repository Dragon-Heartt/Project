import React, { useState } from 'react';
import SidebarUI from './SidebarUI';
import GoogleMap from './GoogleMap';

function App() {
  const [filters, setFilters] = useState({
    spaceType: null,
    hasChair: null,
    hasShade: null
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="App">
      <SidebarUI onFilterChange={handleFilterChange} />
      <GoogleMap filters={filters} />
    </div>
  );
}

export default App; 