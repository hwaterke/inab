import {render} from "react-dom";
import React from "react";
import {Provider} from "react-redux";
import "./styles/modal.css";
import "font-awesome/css/font-awesome.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";
// eslint-disable-next-line import/default
import configureStore from "./store/configureStore";
import {Router, Route, browserHistory, IndexRoute} from "react-router";
import {syncHistoryWithStore} from "react-router-redux";
import BudgetPage from "./components/Budget";
import Main from "./components/Main";
import LandingPage from "./components/LandingPage";
import AccountPage from "./components/AccountPage";
import "./styles/main.scss";

// Needed for onTouchTap (material-ui)
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={history}>
        <Route path="/" component={Main}>
          <IndexRoute component={LandingPage}/>
          <Route path="/budget" component={BudgetPage}/>
          <Route path="/account(/:id)" component={AccountPage}/>
          <Route path="/account/:date/:category_id" component={AccountPage}/>
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app')
);
