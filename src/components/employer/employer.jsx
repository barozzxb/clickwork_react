import React from 'react';
import { Link } from 'react-router-dom';

const Employer = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 text-center">
                    <h1>Employer Page</h1>
                    <p>Welcome to the Employer page!</p>
                    <Link to="/">Go back to Homepage</Link>
                </div>
            </div>
        </div>
    );
}

export default Employer;