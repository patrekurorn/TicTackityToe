import React from "react";
import './styles.css';

const Match = ({ match }) => {

    return (
        <div className='match-container'>
            <p>Match: </p>
            {
                match.isOngoing === true
                ?
                    <div className="match">
                        Participants: <span className="participants">{match.participants[0].username} vs. {match.participants[1].username}</span><br/>
                        <p>Status: <span className="status-of-match">Ongoing</span></p>
                    </div>
                :
                    <div className="match">
                        Participants: <span className="participants">{match.participants[0].username} vs. {match.participants[1].username}</span><br/>
                        <p>Status: <span className="status-of-match">Finished</span></p>
                        {
                            match.winner !== undefined
                            ?
                                <div>
                                    <p>Winner: <span className="status-of-match">{match.winner.username}</span></p>
                                </div>
                            :
                                <div>
                                    <p className="status-of-match">Tie</p>
                                </div>
                        }
                    </div>
            }
        </div>
    )
};

export default Match;
