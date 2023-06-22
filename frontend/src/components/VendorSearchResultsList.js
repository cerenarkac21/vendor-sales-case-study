import { SearchResult } from "./VendorSearchResult";

export const SearchResultsList = ({ results }) => {
  return (
    <div className="results-list">
      {results.map((result, id, _id) => {
        return <SearchResult result={result.name} key={id} _id ={result._id} />;
      })}
    </div>
  );
};