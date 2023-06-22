import { useNavigate } from 'react-router-dom';
import { useState } from "react";

export const SearchResult = ({ result , _id }) => {

  const navigate = useNavigate();
  const [error, setError] = useState(null)

  // Add a loading state
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    console.log(`You selected ${result}! with id ${_id}`)
    fetchData(_id)
  }

  // get vendor by id
  const fetchData = async (_id) => {

    try {
      const response = await fetch("http://localhost:3001/api/vendor/" + _id);
      const json = await response.json();
      if (!response.ok) {
        setError(json.error)
      }
      else{
        console.log("vendor id page ", json)
        navigate(`/vendor/${json._id}/products`, { state: { vendorId: _id } });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="search-result"
      onClick={handleClick}
    >
      {result}
    </div>
  );
};