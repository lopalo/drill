import React from "react";

export default class TrainingWrapper extends React.Component {
    componentDidMount() {
        this.props.onDidMount();
    }
    render() {
        let {phrase, children} = this.props;
        if (phrase) return children;
        return (
          <div className="center">
            <div className="well well-lg">Nothing to train</div>
          </div>
        );
    }
}

