import { useLocation, useNavigate } from 'react-router-dom';
import { useState , useEffect} from 'react';
import { BarLoader } from 'react-spinners';

const MonthlyAnalysis = () => {
  // create a useLocation object to access the states sent to this page
  const location = useLocation();

  // create a useNavigate object to use while redirecting user to another page
  const navigate = useNavigate();

  // get the selected vendor id and its products info from the previous page
  const products = location.state?.products;
  const vendorId = location.state?.vendorId;

  // get the selected year and month info
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // create a state to keep all the cart items for this vendor
  // array of cart_items
  const [CartItems, setCartItems] = useState([]);

  // Add a loading state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const data = await fetchOrdersByTime(selectedYear, selectedMonth); // get orders
        const cartItems = getCartItemsOfThisVendor(data); // filter cart items of this vendor from orders data 
        setCartItems([...cartItems]); // update cart items
        setLoading(false); // Set loading to false after fetching and processing data
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedYear && selectedMonth) { // if both of them selected, fetch data
      fetchData();
    }
  }, [selectedYear, selectedMonth]); // if selectedYear and selectedMonth changes, render useEffect again


  const handleYearButtonClick = (year) => { // year is selected. keep it
    setSelectedYear(year);
  };

  const handleMonthButtonClick = (month) => { //month is selected. keep it
    setSelectedMonth(month);
  };

  // fetch all orders in the selected month of the selected year
  const fetchOrdersByTime = async (year, month) => {
    try {
      const response = await fetch(`http://localhost:3001/api/order/year/${year}/month/${month}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch orders!`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch orders for year ${year} and month ${month}: ${error.message}`);
    }
  };
 
  // get the cart items of this vendor from the orders in selected time
  const getCartItemsOfThisVendor = (data) => {
    const cartItemsOfThisVendor = [];
    
    for (let i = 0; i < data.length; i++) { // iterate orders fetched by time
      const order = data[i];
      const cartItems = order.cart_item;
  
      for (let j = 0; j < cartItems.length; j++) { // iterate cart item array of each order
        const cartItem = cartItems[j];
  
        for (let k = 0; k < products.length; k++) { // iterate vendor's products
          const product = products[k];
  
          // if the product field of the cart item (product id) matches with a product of this vendor, 
          // this means it is a cart item for this vendor.
          if (!cartItemsOfThisVendor.includes(cartItem) && product._id === cartItem.product) { 
            // if the cart item is not already found, add this cart item to the array
            cartItemsOfThisVendor.push(cartItem);
              break; // don't go through other products anymore. the associated product is already found
          }
        }
      }
    }
    return cartItemsOfThisVendor; // return cart items array
  };

  // when bar chart button is clicked, call this function
  const handleRedirect = () => {
    navigate(`/vendor/${vendorId}/products/monthly/visualization`, { state: { products: products } });
  }

  const renderCartItems = () => {
    console.log(CartItems);
  
    // set the loading spinner if data have not been fetched yet
    if (loading) {
      return <BarLoader color="#0056b3" loading={loading} />; // Display the loading icon
    }

    if (!CartItems || CartItems.length === 0) {
      return <p>No cart items to display on {selectedMonth} / {selectedYear}.</p>;
    }
  
    
    return CartItems.map((item) => (
      <div className='cart-item-details'>
      <li key={item._id}>
        <p>Product: {item._id}</p>
        <p>Order Status: {item.order_status}</p>
        <p>Price: {item.price}</p>
        <p>Quantity: {item.quantity}</p>
        <p>Item Count: {item.item_count}</p>
        <p>Series: {item.series}</p>
      </li>
      </div>
    ));
  };
  

  
  return (
    <div className="monthly-details">
      <div className="button-wrapper" >
        <button className="monthly-analysis-button" onClick={() => handleRedirect()}>Bar chart</button>
      </div>
      <span className = "select-time-labels">Select year</span>
      <div className="year-buttons">
        <button className="year-button" onClick={() => handleYearButtonClick(2021)}>2021</button>
        <button className="year-button" onClick={() => handleYearButtonClick(2022)}>2022</button>
        <button className="year-button" onClick={() => handleYearButtonClick(2023)}>2023</button>
      </div>
      <span className = "select-time-labels">Select month</span>
      <div className="month-buttons">
        <button className="month-button" onClick={() => handleMonthButtonClick('01')}>January</button>
        <button className="month-button" onClick={() => handleMonthButtonClick('02')}>February</button>
        <button className="month-button" onClick={() => handleMonthButtonClick('03')}>March</button>
        <button className="month-button" onClick={() => handleMonthButtonClick('04')}>April</button>
        <button className="month-button" onClick={() => handleMonthButtonClick('05')}>May</button>
        <button className="month-button" onClick={() => handleMonthButtonClick('06')}>June</button>
        <button className="month-button" onClick={() => handleMonthButtonClick('07')}>July</button>
        <button className="month-button" onClick={() => handleMonthButtonClick('08')}>August</button>
        <button className="month-button" onClick={() => handleMonthButtonClick('09')}>September</button>
        <button className="month-button" onClick={() => handleMonthButtonClick('10')}>October</button>
        <button className="month-button" onClick={() => handleMonthButtonClick('11')}>November</button>
        <button className="month-button" onClick={() => handleMonthButtonClick('12')}>December</button>
      </div>
      <ul className="cart-items">
        {selectedMonth && selectedYear ? (
        <>
          <span className='select-time-labels'>Sold products on {selectedMonth} / {selectedYear}</span>
          <br></br>
          <span >{CartItems.length} item carts found</span>
          {renderCartItems()}
        </>
        ) : (<p>Please choose a year and a month.</p>)}
      </ul>
      
    </div>
  );
  
};

export default MonthlyAnalysis;