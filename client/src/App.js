import React from "react";
import { Switch, Route } from 'react-router-dom';
import WelcomeView from './views/WelcomeView';
import DashboardView from './views/DashboardView';
import MatchView from "./views/MatchView";
import WithAuthorization from "./components/HOCs/withAuthorization";
import WithAllowAnonymous from "./components/HOCs/withAllowAnonymous";

const App = () => (
    <Switch>
        <Route exact path="/" component={WithAllowAnonymous(WelcomeView)} />
        <Route exact path="/dashboard" component={WithAuthorization(DashboardView)} />
        <Route exact path="/match/:id" component={WithAuthorization(MatchView)} />
    </Switch>
);

export default App;
