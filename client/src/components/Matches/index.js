import React from "react";
import './styles.css';
import Match from "../Match";

const Matches = ({ matches }) => {

    return (
        <div>
            <h1 className="matches-title">Matches ({matches.length}):</h1>
            <div className="matches">
                {matches.map(m => <Match key={m.matchId} match={m}/>)}
            </div>
        </div>
    )
};

export default Matches;
