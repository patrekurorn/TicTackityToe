import React from "react";
import './styles.css';
import ActiveUser from '../ActiveUser';

const ActiveUsers = ({ users }) => {

    const getActiveUsers = users => {
        let activeUsers = [];
        users.forEach((user => {
            if (user.connected) {
                activeUsers.push(user)
            }
        }));
        return activeUsers;
    };

    let allActiveUsers = getActiveUsers(users);

    return (
        <div>
            <h1 className="active-users-title">Active users ({allActiveUsers.length}):</h1>
            <div className="active-users">
                {allActiveUsers.map(u => <ActiveUser key={u.userID} user={u}/>)}
            </div>
        </div>
    )
};

export default ActiveUsers;
