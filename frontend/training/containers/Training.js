import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {createSelector, createStructuredSelector} from "reselect";
import omit from "lodash/omit";

import {
    completeWord,
    deleteCompletedWord,
    passPhrase,
    giveUp,
    listen
} from "../actions";
import Training from "../components/Training";
import TrainingWrapper from "../containers/TrainingWrapper";
import {
    ui,
    wordsStatus,
    isCompleted,
    phrase,
    phraseIndex,
    nextPhraseIndex,
    targetWords
} from "../selectors";


const mapStateToProps = createStructuredSelector({
    wordsStatus,
    phrase,
    isGivenUp: createSelector(ui, ui => ui.isGivenUp),
    isCompleted,

    //data for action creators
    phraseIndex,
    nextPhraseIndex,
    targetWords
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onWordCompleted: completeWord,
    onWordDeleted: deleteCompletedWord,
    onProgressClick: passPhrase(1),
    onNextClick: passPhrase(0),
    onGiveUpClick: giveUp,
    onListenClick: listen,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...omit(stateProps, "phraseIndex", "nextPhraseIndex", "targetWords"),
    ...dispatchProps,
    onProgressClick: () => dispatchProps.onProgressClick(
        stateProps.phraseIndex,
        stateProps.nextPhraseIndex
    ),
    onNextClick: () => dispatchProps.onNextClick(
        stateProps.phraseIndex,
        stateProps.nextPhraseIndex
    ),
    onGiveUpClick: () => dispatchProps.onGiveUpClick(stateProps.targetWords)
});

const TrainingContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Training);

const WrappedTrainingContainer = () => (
  <TrainingWrapper>
    <TrainingContainer />
  </TrainingWrapper>
);


export default WrappedTrainingContainer;
