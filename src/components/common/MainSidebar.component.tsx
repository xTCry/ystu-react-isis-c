import React from 'react';
import classNames from 'classnames';
import { NavLink as RouteNavLink } from 'react-router-dom';
import { Col, Nav, Navbar, NavItem, NavLink } from 'shards-react';

const MainSidebar = ({ toggleSidebarRef }) => {
    const [menuVisible, setMenuVisible] = React.useState(true);
    const [navItems, setNavItems] = React.useState([
        {
            title: 'Main page',
            to: '/main',
            htmlBefore: '<i class="material-icons">edit</i>',
            htmlAfter: '',
        },
        {
            title: 'Data',
            htmlBefore: '<i class="material-icons">table_chart</i>',
            to: '/edit',
        },
    ]);
    const handleToggleSidebar = React.useCallback(() => {
        setMenuVisible(!menuVisible);
    }, [setMenuVisible, menuVisible]);
    toggleSidebarRef.current = handleToggleSidebar;

    const classes = classNames('main-sidebar', 'px-0', 'col-12', menuVisible && 'open');

    return (
        <Col tag="aside" className={classes} lg={{ size: 1 }} md={{ size: 1 }}>
            <div className="main-navbar">
                <Navbar className="align-items-stretch bg-white flex-md-nowrap border-bottom p-0" type="light">
                    {/* <NavbarBrand className="w-100 mr-0" href="#" style={{ lineHeight: '25px' }}>
                        <div className="d-table m-auto">
                            <img
                                id="main-logo"
                                className="d-inline-block align-top mr-1"
                                style={{ maxWidth: '25px' }}
                                src={logoSvg}
                                alt="Logo"
                            />
                            {!hideLogoText && <span className="d-none d-md-inline ml-1">YSTU ISIS C</span>}
                        </div>
                    </NavbarBrand> */}
                    <a className="toggle-sidebar d-sm-inline d-md-none d-lg-none" onClick={handleToggleSidebar}>
                        <i className="material-icons">&#xE5C4;</i>
                    </a>
                </Navbar>
            </div>

            <div className="nav-wrapper">
                <Nav className="nav--no-borders flex-column">
                    {navItems.map((item, idx) => (
                        <SidebarNavItem key={idx} item={item} />
                    ))}
                </Nav>
            </div>
        </Col>
    );
};

const SidebarNavItem = ({ item }) => (
    <NavItem>
        <NavLink tag={RouteNavLink} to={item.to}>
            {item.htmlBefore && (
                <div
                    className="d-inline-block item-icon-wrapper"
                    dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
                />
            )}
            {item.title && <span>{item.title}</span>}
            {item.htmlAfter && (
                <div
                    className="d-inline-block item-icon-wrapper"
                    dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
                />
            )}
        </NavLink>
    </NavItem>
);

export default MainSidebar;
