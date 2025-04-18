import React from  'react';
import { Link } from 'react-router-dom';

const Employee = () => {
    return (
        <div className="container">
            <h1>Employee Page</h1>
            <p>This is the employee page.</p>
            <Link to="/">Go to Homepage</Link>
        
        </div>
    );
}

export default Employee;