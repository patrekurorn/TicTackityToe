import React from "react";
import './styles.css';
import User from '../User';

const Users = ({ users }) => {

    return (
        <div>
            <h1 className="users-title">All users ({users.length}):</h1>
            <div className="users">
                {users.map(u => <User key={u.userID} user={u}/>)}
            </div>
        </div>
    )
};

export default Users;
