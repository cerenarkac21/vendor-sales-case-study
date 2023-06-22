import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";


export const SearchBar = ({ setResults }) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/vendor");
      const json = await response.json();
  
      const results = json.filter((vendor) => {
        return (
          searchQuery &&
          vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
  
      setResults(results);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleChange = (value) => {
    setSearchQuery(value);
    fetchData();
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Type to search..."
        value={searchQuery}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

