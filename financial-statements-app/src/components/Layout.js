import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <header>
                <h1>Financial Statements App</h1>
            </header>
            <main>{children}</main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Financial Statements App</p>
            </footer>
        </div>
    );
};

export default Layout;