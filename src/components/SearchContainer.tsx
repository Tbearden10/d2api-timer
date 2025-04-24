import React from "react";
import SearchBar from "./SearchBar";

interface SearchContainerProps {
  onSearch: (bungieName: string) => void;
  loading: boolean;
}

const SearchContainer: React.FC<SearchContainerProps> = ({ onSearch, loading }) => {
  return (
    <div >
      <SearchBar onSearch={onSearch} loading={loading} />
    </div>
  );
};

export default SearchContainer;