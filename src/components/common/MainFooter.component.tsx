import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Row, Nav, NavItem, NavLink } from 'shards-react';
import packageJson from '../../../package.json';

const MainFooter = ({ contained, menuItems, copyright }) => (
    <footer className="main-footer d-flex p-2 px-3 bg-white border-top">
        <Container fluid={contained}>
            <Row>
                <Nav>
                    {menuItems.map((item, idx) => (
                        <NavItem key={idx}>
                            {item.to && (
                                <NavLink tag={Link} to={item.to}>
                                    {item.title}
                                </NavLink>
                            )}
                            {item.href && (
                                <NavLink>
                                    <a href={item.href}>{item.title}</a>
                                </NavLink>
                            )}
                        </NavItem>
                    ))}
                </Nav>
                <span className="copyright ml-auto my-auto mr-2">
                    {copyright} - v{packageJson.version}
                </span>
            </Row>
        </Container>
    </footer>
);

MainFooter.propTypes = {
    /**
     * Whether the content is contained, or not.
     */
    contained: PropTypes.bool,
    /**
     * The menu items array.
     */
    menuItems: PropTypes.array,
    /**
     * The copyright info.
     */
    copyright: PropTypes.string,
};

MainFooter.defaultProps = {
    contained: false,
    copyright: 'Copyright © 2021 xT',
    menuItems: [
        {
            title: 'Home',
            to: '/',
        },
        {
            title: 'About',
            to: '/about',
        },
        {
            title: 'Downlaod test.csv',
            href: '/exmpl_data.csv',
        },
        {
            title: 'Downlaod bad.csv',
            href: '/exmpl_data-bad.csv',
        },
    ],
};

export default MainFooter;
