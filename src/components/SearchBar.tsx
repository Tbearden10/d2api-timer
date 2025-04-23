import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (bungieName: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [bungieName, setBungieName] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (bungieName.trim()) {
      onSearch(bungieName);
    }
  };

  return (
    <form onSubmit={handleSubmit} id="search">
      <input
        type="text"
        id="bungieid"
        value={bungieName}
        onChange={(e) => setBungieName(e.target.value)}
        placeholder="Enter Bungie Name"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;