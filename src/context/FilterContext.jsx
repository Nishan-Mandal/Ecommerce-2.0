import React, { createContext, useState, useContext } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [searchkey, setSearchkey] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPrice, setFilterPrice] = useState('');

  const clearFilters = () => {
    setSearchkey('');
    setFilterType('');
    setFilterPrice('');
  };

  return (
    <FilterContext.Provider value={{ 
      searchkey, setSearchkey, 
      filterType, setFilterType, 
      filterPrice, setFilterPrice,
      clearFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
