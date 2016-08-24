import zipWith from "lodash/zipWith";
import every from "lodash/every";
import last from "lodash/last";

import {createSelector as create} from "reselect";


const WORD_STATUS = {OK: "OK", WARNING: "WARNING", ERROR: "ERROR"};

const training = state => state.pages.training;

const ui = create(training, training => training.ui);

const workingSet = create(training, training => training.workingSet);

const phraseIndex = create(ui, ui => ui.phraseIndex);

const nextPhraseIndex = create(
    phraseIndex,
    workingSet,
    (index, workingSet) => workingSet.length - 1 === index ? 0 : index + 1
);

const phrase = create(
    workingSet,
    phraseIndex,
    (workingSet, index) => workingSet[index]
);


const getWords = text => text.split(" ");

const compareWords = (target, actual) => {
    if (!target || !actual) {
        return WORD_STATUS.ERROR;
    }
    if (target === actual) {
        return WORD_STATUS.OK;
    }
    target = target.toLowerCase();
    actual = actual.toLowerCase();
    if (target === actual) {
        return WORD_STATUS.WARNING;
    }
    let lastChar = last(target);
    let initStr = target.slice(0, -1);
    if (initStr === actual) {
        switch (lastChar) {
            case ",":
            case ".":
                return WORD_STATUS.WARNING;
        }
    }
    return WORD_STATUS.ERROR;
};

const targetWords = create(phrase, phrase => getWords(phrase.targetText));

const wordsStatus = create(
    targetWords,
    ui,
    (targetWords, ui) => zipWith(
        targetWords,
        ui.completedWords,
        (target, actual) => ({
            target,
            actual,
            status: compareWords(target, actual)
        })
    )
);

const isCompleted = create(
    wordsStatus,
    ui,
    (wordsStatus, ui) => (
        !ui.isGivenUp &&
        every(wordsStatus, i => i.status !== WORD_STATUS.ERROR)
    )
);


const isLastWord = create(
    targetWords,
    ui,
    (target, ui) => target.length == ui.completedWords.length + 1
);


const lastWord = create(targetWords, last);


export {
    WORD_STATUS,
    ui,
    phrase,
    phraseIndex,
    nextPhraseIndex,
    wordsStatus,
    isCompleted,
    targetWords,
    isLastWord,
    lastWord
};


