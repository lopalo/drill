import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {createSelector, createStructuredSelector} from "reselect";

import {
    completeWord,
    deleteCompletedWord,
    passPhrase,
    giveUp,
    listen
} from "../actions";

import {
    ui,
    wordsStatus,
    isCompleted,
    phrase,
    isLastWord,
    lastWord
} from "../selectors";


class TrainingContent extends React.Component {
    constructor(props) {
        super(props);
        this._input = null;
    }
    handleTextInput() {
        if (!this.props.isLastWord) return;
        var val = this._input.value.trim();
        if (val === this.props.lastWord) {
            this.props.onWordCompleted(val);
            this._input.value = "";
        }
    }
    handleKeyDown(event) {
        var val = this._input.value.trim();
        switch (event.key) {
            case " ":
            case "Enter":
                if (val) {
                    this.props.onWordCompleted(val);
                    this._input.value = "";
                }
                break;
            case "Backspace":
            case "Delete":
                if (!val) {
                    this.props.onWordDeleted();
                    this._input.value = "";
                }
                break;
            case "Escape":
                this.props.onGiveUpClick();
                break;
        }
    }
    handleButtonKeyDown(event) {
        if (event.keyCode === 76) {
            this.props.onListenClick();
        }
    }
    render() {
        let {
            phrase,
            isGivenUp,
            isCompleted,
            wordsStatus,
            speechSynthIsActive,

            onProgressClick,
            onNextClick,
            onGiveUpClick,
            onListenClick
        } = this.props;
        let progress = phrase.progress / phrase.repeats * 100;
        let barClass = "progress-bar ";
        if (phrase.isCompleted) {
            barClass += "progress-bar-success";
        } else {
            barClass += "progress-bar-info";
        }
        let listenBtnClass = "btn btn-default";
        if (speechSynthIsActive) {
            listenBtnClass += " active";
        }
        return (
          <div className="panel panel-default">
            <div className="panel-body text-center">
              <h4 className="well">{phrase.sourceText}</h4>
              <div className="panel panel-default">
                <div className="panel-body form-inline">
                  {wordsStatus.map((i, idx) => <WordStatus key={idx} {...i} />)}
                  {!isCompleted && !isGivenUp &&
                    <input
                      type="text"
                      className="form-control"
                      onChange={() => this.handleTextInput()}
                      onKeyDown={e => this.handleKeyDown(e)}
                      ref={i => this._input = i}
                      autoFocus={true} />
                  }
                </div>
              </div>
              <div className="progress progress-striped active">
                <div className={barClass}
                     style={{width: `${progress}%`, minWidth: "4em"}}>
                  {phrase.progress} / {phrase.repeats}
                </div>
              </div>
              <div className="button-panel">
                {!isCompleted && !isGivenUp &&
                  <button className="btn btn-default" onClick={onGiveUpClick}>
                    Give Up
                  </button>
                }
                {isCompleted &&
                  <button
                    className="btn btn-success"
                    onClick={onProgressClick}
                    onKeyDown={e => this.handleButtonKeyDown(e)}
                    autoFocus={true}>
                    Progres +1
                  </button>
                }
                {isGivenUp &&
                  <button
                    className="btn btn-default"
                    onKeyDown={e => this.handleButtonKeyDown(e)}
                    onClick={onNextClick}
                    autoFocus={true}>
                    Next
                  </button>
                }
                {(isCompleted || isGivenUp) &&
                  <button className={listenBtnClass} onClick={onListenClick}>
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
        return <div className="btn btn-info">{actual}</div>;
    }
    if (status === "error") {
        return <div className="btn btn-danger">{actual}</div>;
    }

};


const mapStateToProps = createStructuredSelector({
    wordsStatus,
    phrase,
    isGivenUp: createSelector(ui, ui => ui.isGivenUp),
    isCompleted,
    isLastWord,
    lastWord,
    speechSynthIsActive: createSelector(ui, ui => ui.speechSynthIsActive),
});


const mapDispatchToProps = dispatch => bindActionCreators({
    onWordCompleted: completeWord,
    onWordDeleted: deleteCompletedWord,
    onProgressClick: passPhrase(1),
    onNextClick: passPhrase(0),
    onGiveUpClick: giveUp,
    onListenClick: listen,
}, dispatch);


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrainingContent);

