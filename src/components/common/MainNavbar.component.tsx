import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Container, Navbar } from 'shards-react';

const MainNavbar = ({ handleToggleSidebar, stickyTop }) => {
    const classes = classNames('main-navbar', 'bg-white', stickyTop && 'sticky-top');
    const handleClick = React.useCallback((e) => {
        e.preventDefault();
        handleToggleSidebar();
    }, [handleToggleSidebar]);
    return (
        <div className={classes}>
            <Container className="p-0">
                <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
                    {/* <NavbarSearch /> */}
                    {/* <NavbarNav /> */}
                    <NavbarToggle handleClick={handleClick} />
                </Navbar>
            </Container>
        </div>
    );
};

const NavbarToggle = ({ handleClick }) => (
    <nav className="nav">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a
            href="#"
            onClick={handleClick}
            className="nav-link nav-link-icon toggle-sidebar d-sm-inline d-md-inline d-lg-none text-center"
        >
            <i className="material-icons">&#xE5D2;</i>
        </a>
    </nav>
);

MainNavbar.propTypes = {
    /**
     * Whether the main navbar is sticky to the top, or not.
     */
    stickyTop: PropTypes.bool,
};

MainNavbar.defaultProps = {
    stickyTop: true,
};

export default MainNavbar;
