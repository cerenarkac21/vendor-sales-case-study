import {Link} from 'react-router-dom';

const Navbar = () => {
    return(
        <header>
            <div className = "container">
                <Link to = "/">
                    <h1>
                        Vendor Sales Case Study
                    </h1>
                </Link>
            </div>
        </header>
    )
}

export default Navbar;
