import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';
import { Container, Row, Col } from 'shards-react';

import Home from './pages/Home';
import MainPage from './pages/Main.page';
import { Process } from './pages/Process';

import TableEditor from './components/editor/Table.editor';
import MainNavbar from './components/common/MainNavbar.component';
import MainSidebar from './components/common/MainSidebar.component';
import MainFooter from './components/common/MainFooter.component';

import { csv_data } from './utils/inputData.util';

import 'bootstrap/dist/css/bootstrap.min.css';
// import "shards-ui/dist/css/shards.min.css"
import '../src/styles/shards-dashboards.1.1.0.css';

const DefaultLayout = ({ children }) => {
    const handleToggleSidebar = React.useRef();

    return (
        <Container fluid>
            <Row>
                <MainSidebar toggleSidebarRef={handleToggleSidebar} />
                <Col
                    className="main-content p-0"
                    lg={{ size: 11, offset: 1 }}
                    md={{ size: 11, offset: 1 }}
                    sm="12"
                    tag="main"
                >
                    <MainNavbar handleToggleSidebar={handleToggleSidebar.current} />
                    {children}
                    <MainFooter />
                </Col>
            </Row>
        </Container>
    );
}
const App = () => (
    <Router>
        <DefaultLayout>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/main">
                    <MainPage />
                </Route>

                <Route path="/proecess">
                    <Process data={csv_data} />
                </Route>
                <Route exact path="/edit">
                    <TableEditor data={csv_data} />
                </Route>

                <Route path="*">
                    <Redirect to="/" />
                </Route>
            </Switch>
        </DefaultLayout>
    </Router>
);

export default App;
