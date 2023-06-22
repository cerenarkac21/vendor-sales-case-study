import { useLocation, useNavigate} from 'react-router-dom';
import { useEffect, useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { BarLoader } from 'react-spinners';

const ViewProducts = () => {

    // create a useLocation object to access the states sent to this page
    const location = useLocation();

    // create a useNavigate object to use while redirecting user to another page
    const navigate = useNavigate();

    // create a state to follow the search query for any change
    const [searchQuery, setSearchQuery] = useState("");

    // create a state to follow the selected product
    const [selectedProductId, setSelectedProductId] = useState("");

    // create a state to follow the products of the vendor selected in the previous page
    const [products, setProducts] = useState([]);

    // create a state to follow the search results for the search query
    const [filteredProducts, setFilteredProducts] = useState([]);

    // create a state to show the gain from the selected product in total
    const [gainFromThisProduct, setGainFromThisProduct] = useState();

    // create a state to keep the information of the numbers of orders for the selected products
    const [numOfOrders, setNumOfOrders] = useState();

    // create a state to keep the information of gain for an order for the selected product 
    const [gainOfAnOrder, setGainOfAnOrder] = useState([]);

    const [isSearcButtonClicked, setIsSearchButtonClicked] = useState(false);

    // Add a loading state
    const [loading, setLoading] = useState(false);

    // get the selected vendor id info from the previous page
    const vendorId = location.state?.vendorId;

    // render this function whenever the selected product changes
    const calculateGain = useCallback((json, productId) => {
      // gain for the selected product from all orders in total
      let totalGain = 0;
      // keep gains from each order in an array 
      let gains = [];
  
      setNumOfOrders(json.orders.length);
  
      for (let i = 0; i < json.orders.length; i++) {
        let gainFromAnOrder = 0;
  
        for (let index = 0; index < json.orders[i].cart_item.length; index++) {
          if (json.orders[i].cart_item[index].product === productId) {
            gainFromAnOrder = json.orders[i].cart_item[index].cogs * (json.orders[i].cart_item[index].item_count * json.orders[i].cart_item[index].quantity);
          }
        }
        gains.push(gainFromAnOrder);
        totalGain += gainFromAnOrder;
      }
      // set states
      setGainFromThisProduct(totalGain);
      setGainOfAnOrder(gains);
    }, []);
  
    // call this function when the page is rendered.
    // get the products of the selected vendor
    useEffect(() => {
      const fetchProductsOfVendor = async (vendorId) => {
        try {
          setLoading(true); // Set loading to true before fetching data
          const response = await fetch("http://localhost:3001/api/vendor/" + vendorId + "/products");
          const json = await response.json();

          if (!response.ok) {
            console.error("Error:", json.error);
          }
          else{
            console.log("products here:", json)
            setProducts(json.products); // Update the products state with the fetched data
            setLoading(false); // Set loading to false after fetching and processing data
          }
    
      
        } catch (error) {
          console.error(error);
        }
      };
      fetchProductsOfVendor(vendorId)
    }, [vendorId]);

    // call this function when the searched query is changed
    const handleChange = (value) => {
      setSearchQuery(value);
      filterProducts(value);
    };

    // filter search results for search bar
    const filterProducts = (searchQuery) => {
      const filteredProducts = products.filter((product) =>
        searchQuery && product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filteredProducts);
    };

    // call this function to get the orders of the selected function when the search button is clicked
    const handleSearch = () => {
      const fetchOrdersOfSelectedProductId = async (productId) => {
        try {
          console.log("selected product: ", productId);
          const response = await fetch(`http://localhost:3001/api/product/${productId}/orders`);
          const json = await response.json();
  
          if (!response.ok) {
            console.error("Error:", json.error);
          } else {
            console.log("orders of the selected product: ", json);

            setIsSearchButtonClicked(true);

            // calculate gain from the selected product
            calculateGain(json, productId);
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchOrdersOfSelectedProductId(selectedProductId);
    };

    // a search result is clicked
    const handleClick = (productId) => {
      setSelectedProductId(productId) // get the selected product id
      setSearchQuery(products.find(product => product._id === productId)?.name || ""); // update searched query with the selected product id
      setFilteredProducts([]); // hide search results
    };

    // when monthly analysis button is clicked, call this function
    const handleRedirect = () => {
      navigate(`/vendor/${vendorId}/products/monthly`, { state: { vendorId: vendorId, products: products } });
    }

    return (
      <div>
        <div className="home">
          <div className="button-wrapper-details">
            <button className="monthly-analysis-button" onClick={() => handleRedirect()}>Monthly analysis</button>
          </div>
    
          <div className="search-bar">
            <div className="input-wrapper">
              <FaSearch id="search-icon" />
              <input
                placeholder="Product here"
                value={searchQuery}
                onChange={(e) => handleChange(e.target.value)}
              />
              <button className="search-button" onClick={handleSearch}>
                <i className="fa fa-search" style={{ fontSize: '18px' }}></i>
                Search
              </button>
            </div>
            {products.length !== 0 && (
              <div className="results-list">
                {filteredProducts &&
                  filteredProducts.map((filteredProduct) => (
                    <div
                      className='search-result'
                      key={filteredProduct._id}
                      onClick={() => handleClick(filteredProduct._id)}
                    >
                      <h3>{filteredProduct.name}</h3>
                    </div>
                  ))}
              </div>
            )}
          </div>
    
          {isSearcButtonClicked && (
            <div className="product-details">
              <h1 className='product-details-header'>Product Details</h1>
              {numOfOrders === 0 ? (
                <div className="no-orders-message">No orders found</div>
              ) : (
                <>
                  <div className="total-gain-item">
                    <span className="total-gain-label">Number of Orders:</span>
                    <span className="total-gain-value">{numOfOrders}</span>
                  </div>
                  <div className="listed-gain-item">
                    <span className="gain-item-label">Gains from each order:</span>
                    <ul className="gain-list">
                      {gainOfAnOrder.map((gain, index) => (
                        <li key={index} className="gain-item">
                          {gain.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="total-gain">
                    <div className="total-gain-item">
                      <span className="total-gain-label">Total Gain:</span>
                      <span className="total-gain-value">{Number(gainFromThisProduct).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {loading &&(
            <div>
              <span>Fetching products... </span>
              <br></br>
              <BarLoader color="#0056b3" loading={loading} />
            </div>
          )}
    
          {!loading && products.length === 0 && (
            <div>
              <span>No products for this vendor</span>
            </div>
          )}
        </div>
      </div>
    );
    
    
};

export default ViewProducts;