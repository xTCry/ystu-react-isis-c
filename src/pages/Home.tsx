import { Link } from 'react-router-dom';

const Home = () => (
    <>
        <div className="header">
            <h1 className="title">ISIS Crs</h1>
            <h2 className="subtitle">Crs project</h2>
            <div className="links">
                <a className="btn btn-gh" href="/#/v7">
                    V7
                </a>
            </div>
        </div>
        <hr />
        <div className="categories">
            <div className="category">
                <h3 className="title">Graphics</h3>
                <ul className="items">
                    <li className="entry">
                        <Link to="/variants/0">List variants (1)</Link>
                    </li>
                    <li className="entry">
                        <Link to="/variants/1">List variants (2)</Link>
                    </li>
                    <li className="entry">
                        <Link to="/v6">V6</Link>
                    </li>
                    <li className="entry">
                        <Link to="/v7">V7</Link>
                    </li>
                </ul>
            </div>
            <div className="category">
                <h3 className="title">Data</h3>
                <ul className="items">
                    <li className="entry">
                        <Link to="/edit">Edit data</Link>
                    </li>
                </ul>
            </div>
        </div>
        <hr />

        <div className="footer">
            <h6>
                MarmeladDoss <a href="/">Main page</a>
            </h6>
        </div>
    </>
);

export default Home;
