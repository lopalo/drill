/*global SpeechSyntheisUtterance*/
import {put, select, cps} from "redux-saga/effects";

import {
    REQUEST_WORKING_SET,
    PASS_PHRASE,
    COMPLETE_PHRASE,
    LISTEN,
    addPhrase
} from "./actions";
import {phrase} from "./selectors";
import {setProperty} from "../common/actions";
import {
    fetchJSON,
    takeEverySafely as takeEvery,
    takeLatestSafely as takeLatest
} from "../common/sagas";


const synth = window.speechSynthesis;
const getVoice = () => synth.getVoices().find(
    v => v.name === "Google UK English Male"
);


function* fetchWorkingSet() {
    yield* takeLatest(REQUEST_WORKING_SET, function* () {
        let set = yield* fetchJSON("/training/working-set");
        yield put(setProperty("pages.training.workingSet", set));
    });
}


function* passPhrase() {
    yield* takeEvery(PASS_PHRASE, function* ({progress}) {
        yield* cancelSpeech();
        let {id, completionTime} = yield select(phrase);
        let url = "/training/increment-progress";
        if (!progress || completionTime !== null) return;
        yield* fetchJSON(url, {id, progress}, {method: "POST"});
    });
}


function* completePhrase() {
    yield* takeEvery(COMPLETE_PHRASE, function* ({phraseId: id}) {
        yield* cancelSpeech();
        let url = "/training/working-set";
        let newPhrase = yield* fetchJSON(url, {id}, {method: "POST"});
        yield put(addPhrase(newPhrase));
    });
}


function* listen() {
    yield * takeEvery(LISTEN, activateSpeech);
}


function* activateSpeech() {
    yield* cancelSpeech();
    let {targetText} = yield select(phrase);
    let utterance = new SpeechSynthesisUtterance(targetText);
    utterance.voice = getVoice();
    synth.speak(utterance);
    yield put(setProperty("pages.training.ui.speechSynthIsActive", true));
    yield cps(cb => {utterance.onend = () => cb(null, true);});
    yield put(setProperty("pages.training.ui.speechSynthIsActive", false));
}


function* cancelSpeech() {
    synth.cancel();
    yield put(setProperty("pages.training.ui.speechSynthIsActive", false));
}



export default [
    fetchWorkingSet,
    passPhrase,
    completePhrase,
    listen
];

