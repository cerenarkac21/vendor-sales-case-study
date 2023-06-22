import { useLocation , useNavigate} from 'react-router-dom';
import { useState , useEffect} from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ClipLoader } from 'react-spinners';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale, 
    Legend
)

const MonthlyGraph = () => {

    // keep the selected year and month info
    const [selectedYear, setSelectedYear] = useState("");

    // create a useLocation object to access the states sent to this page
    const location = useLocation();

    // get products info from the previous page
    const products = location.state?.products;

    // keep gains array to use it while creating bar chart
    const [GainsFromAllMonths, setGainsFromAllMonths] = useState([]);

    // keep cart items for all months of the selected year (array of arrays)
    const [AllMonthsData, setAllMonthsData] = useState([]);

    // Add a loading state
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true); // Set loading to true when fetching data
            const requests = [];
            for (let i = 1; i <= 12; i++) {
              const request = fetchOrdersByTime(selectedYear, i);
              requests.push(request);
            }
            const responses = await Promise.all(requests);
            const monthsData = responses.map((data) => getCartItemsOfThisVendor(data));
            console.log('All months data:', monthsData);
            // update array with the fetched data
            setAllMonthsData([...monthsData]);
            setLoading(false); // Set loading to false after fetching and processing data
          } catch (error) {
            console.error(error);
          }
        };
      
        if (selectedYear) { // if a year is selected, fetch data
          fetchData();
        }
      }, [selectedYear]); // if selectedYear changes, rerender useEffect function
      

    useEffect(() => {
    if (AllMonthsData.length > 0) { // cart items for all months are fetched, calculate gains out of them
        const gains = CalculateGainsFromMonths(); // keep them in an array
        setGainsFromAllMonths([...gains]); // update state with gains array
    }
    }, [AllMonthsData]); // if AllMonthsData changes, calculate gains again

    const handleYearButtonClick = (year) => { // year is selected. keep it
        setSelectedYear(year);
    };

    // fetch data based on month and year. use it in a loop of 12 iterations
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
     
      // same function as the one in MonthlyAnaysis.js
      const getCartItemsOfThisVendor = (data) => {
        const cartItemsOfThisVendor = [];
        
        for (let i = 0; i < data.length; i++) {
          const order = data[i];
          const cartItems = order.cart_item;
      
          for (let j = 0; j < cartItems.length; j++) {
            const cartItem = cartItems[j];
      
            for (let l = 0; l < products.length; l++) {
              const product = products[l];
      
              if (!cartItemsOfThisVendor.includes(cartItem) && product._id === cartItem.product) {
                cartItemsOfThisVendor.push(cartItem);
                  break;
              }
            }
          }
        }
        
        return cartItemsOfThisVendor;
      };

    // create required input to create bar chart
    const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Agu", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
        {
            label: "Monthly sales from Lonca",
            data: GainsFromAllMonths,
            backgroundColor: "#0056b3",
            borderColor: "white",
            borderWidth: 1
            }
        ]
        
        
    }

    const options = {
    };
    

    const CalculateGainsFromMonths = () => {
        // form graph data here
        let gains = [];
        for (let i = 0; i < AllMonthsData.length; i++) {
            let gainForThisMonth = 0;
            for (let index = 0; index < AllMonthsData[i].length; index++) {
                gainForThisMonth += AllMonthsData[i][index].cogs * (AllMonthsData[i][index].item_count * AllMonthsData[i][index].quantity);
            }
              gains.push(gainForThisMonth);
        }
        return gains;
    };

  
  return (
    <div className="monthly-details">
      <div className="year-buttons">
        <button className="year-button" onClick={() => handleYearButtonClick(2021)}>2021</button>
        <button className="year-button" onClick={() => handleYearButtonClick(2022)}>2022</button>
        <button className="year-button" onClick={() => handleYearButtonClick(2023)}>2023</button>
      </div>
      <div style={{ position: 'relative', padding: "20px", width: '90%', minHeight: '300px' }}>
        {loading &&(
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <ClipLoader />
          </div>
        )}
        <Bar data={data} options={options} />
      </div>
    </div>
  );
  
};

export default MonthlyGraph;
