import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Link,  } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';

import Home from './pages/Home';
import Variants from './pages/Variants';

import './styles/index.css';
import './styles/reset.css';
import reportWebVitals from './reportWebVitals';

import { csv_data } from './csv_data';

import { Variant6 } from './components/variants/Variant6';
import { Variant7 } from './components/variants/Variant7';
import TableEditor from './components/editor/Table.editor';

ReactDOM.render(
    <React.StrictMode>
        <div className="content">
            <Router>
                <Link to="/">Main page</Link>
                <hr />
                <Switch>
                    <Route path="/v6">
                        <Variant6 data={csv_data} />
                    </Route>
                    <Route path="/v7">
                        <Variant7 data={csv_data} />
                    </Route>
                    <Route exact path="/variants" component={Variants} />
                    <Route exact path="/variants/:variant" component={Variants} />
                    <Route exact path="/edit" component={TableEditor} />
                    <Route exact path="/" component={Home} />

                    <Route path="*">
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </Router>
        </div>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
