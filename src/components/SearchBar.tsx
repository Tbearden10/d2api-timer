import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (bungieName: string) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [bungieName, setBungieName] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (bungieName.trim()) {
      onSearch(bungieName);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={bungieName}
        onChange={(e) => setBungieName(e.target.value)}
        placeholder="Enter Bungie Name"
      />
      <button type="submit" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchBar;