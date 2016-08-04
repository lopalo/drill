import React from "react";

export default class Training extends React.Component {
    handleTextInput(event) {
        let value = event.target.value;
        if (!value) {
            this.props.onWordDeleted();
            event.target.value = " ";
            return;
        }
        if (value.slice(-1) === " ") {
            value = value.trim();
            if (value) {
                this.props.onWordCompleted(event.target.value.trim());
                event.target.value = " ";
            }
        }
    }
    render() {
        let {
            phrase,
            isGivenUp,
            isCompleted,
            wordsStatus,

            onProgressClick,
            onNextClick,
            onGiveUpClick,
            onListenClick
        } = this.props;
        let progress = phrase.progress / phrase.repeats * 100;
        let progressBarStyle = {width: `${progress}%`};
        return (
          <div className="panel panel-default">
            <div className="panel-body text-center">
              <h4 className="well">{phrase.sourceText}</h4>
              <div className="panel panel-default">
                <div className="panel-body form-inline">
                  {wordsStatus.map((i, idx) => <WordStatus key={idx} {...i} />)}
                  {!isCompleted && !isGivenUp &&
                    <input type="text"
                           className="form-control"
                           onChange={e => this.handleTextInput(e)}
                           autoFocus={true} />
                  }
                </div>
              </div>
              <div className="progress progress-striped active">
                <div className="progress-bar progress-bar-success"
                     style={progressBarStyle}>
                  {phrase.progress} / {phrase.repeats}
                </div>
              </div>
              <div className="button-panel">
                {!isCompleted && !isGivenUp &&
                  <button className="btn btn-danger" onClick={onGiveUpClick}>
                    Give Up
                  </button>
                }
                {isCompleted &&
                  <button className="btn btn-success"
                          onClick={onProgressClick}
                          autoFocus={true}>
                    Progres +1
                  </button>
                }
                {isGivenUp &&
                  <button className="btn btn-default"
                          onClick={onNextClick}
                          autoFocus={true}>
                    Next
                  </button>
                }
                {(isCompleted || isGivenUp) &&
                  <button className="btn btn-default" onClick={onListenClick}>
                    <span className="glyphicon glyphicon-volume-up">
                    </span>
                  </button>
                }
              </div>
            </div>
          </div>
        );
    }
}

const WordStatus = ({actual, status}) => {
    if (!actual) return null;
    if (status === "ok") {
        return <div className="btn btn-success">{actual}</div>;
    }
    if (status === "error") {
        return <div className="btn btn-danger">{actual}</div>;
    }

};

