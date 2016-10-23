import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {createSelector, createStructuredSelector} from "reselect";

import {
    completeWord,
    deleteCompletedWord,
    passPhrase,
    giveUp,
    speak,
    requestWorkingSet
} from "../actions";

import {
    WORD_STATUS,
    ui,
    wordsStatus,
    isCompleted,
    phrase,
    isLastWord,
    lastWord
} from "../selectors";


var mapStateToProps;
var mapDispatchToProps;


var Training = class extends React.Component {
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
            this.props.onSpeakClick();
        }
    }
    render() {
        let {
            phrase,
            isGivenUp,
            isCompleted,
            wordsStatus,
            speechIsActive,

            onProgressClick,
            onNextClick,
            onGiveUpClick,
            onSpeakClick
        } = this.props;
        let progress = phrase.progress / phrase.repeats * 100;
        let barClass = "progress-bar ";
        if (phrase.isCompleted) {
            barClass += "progress-bar-success";
        } else {
            barClass += "progress-bar-info";
        }
        let speakBtnClass = "btn btn-default";
        if (speechIsActive) {
            speakBtnClass += " active";
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
                  <button className={speakBtnClass} onClick={onSpeakClick}>
                    <span className="glyphicon glyphicon-volume-up">
                    </span>
                  </button>
                }
              </div>
            </div>
          </div>
        );
    }
};


const WordStatus = ({target, actual, status}) => {
    if (!actual) return null;
    let btnClass = "btn ";
    switch (status) {
        case WORD_STATUS.OK:
            btnClass += "btn-info";
            break;
        case WORD_STATUS.WARNING:
            btnClass += "btn-warning";
            break;
        case WORD_STATUS.ERROR:
            btnClass += "btn-danger";
            break;
    }
    btnClass += " btn-tooltip";
    return (
      <div className={btnClass}>
        {actual}
        {target && <span className="btn-tooltip-text">{target}</span>}
      </div>
    );
};


mapStateToProps = createStructuredSelector({
    wordsStatus,
    phrase,
    isGivenUp: createSelector(ui, ui => ui.isGivenUp),
    isCompleted,
    isLastWord,
    lastWord,
    speechIsActive: createSelector(ui, ui => ui.speechIsActive),
});


mapDispatchToProps = dispatch => bindActionCreators({
    onWordCompleted: completeWord,
    onWordDeleted: deleteCompletedWord,
    onProgressClick: () => passPhrase(1),
    onNextClick: () => passPhrase(0),
    onGiveUpClick: giveUp,
    onSpeakClick: speak,
}, dispatch);


Training = connect(
    mapStateToProps,
    mapDispatchToProps
)(Training);


class TrainingWrapper extends React.Component {
    componentDidMount() {
        this.props.onDidMount();
    }
    render() {
        let {phrase} = this.props;
        if (phrase) return <Training />;
        return (
          <div className="center">
            <div className="well well-lg">Nothing to train</div>
          </div>
        );
    }
}


mapStateToProps = createStructuredSelector({phrase});

mapDispatchToProps = dispatch => bindActionCreators({
    onDidMount: requestWorkingSet
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrainingWrapper);




