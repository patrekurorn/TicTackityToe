import React from "react";

const WithAllowAnonymous  = (WrappedComponent) => {

    return class extends React.Component {
        state = {
            isHidden: true
        };

        componentDidMount() {
            let sessionID = localStorage.getItem("s.id");

            if (sessionID) {
                this.props.history.push('/dashboard');
            } else {
                this.setState({ isHidden: false });
            }
        }

        render() {
            const { isHidden } = this.state;
            return isHidden ? <></> : <WrappedComponent {...this.props} />;
        }
    }
};

export default WithAllowAnonymous;
