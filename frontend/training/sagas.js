import {put, select, cps} from "redux-saga/effects";

import {
    REQUEST_WORKING_SET,
    COMPLETE_WORD,
    PASS_PHRASE,
    COMPLETE_PHRASE,
    SPEAK,
    addPhrase
} from "./actions";
import {profile} from "../common/selectors";
import {phrase, isCompleted} from "./selectors";
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
    yield* takeEvery(PASS_PHRASE, function* ({progress, phraseId: id}) {
        yield* cancelSpeech();
        let url = "/training/increment-progress";
        if (!progress) return;
        yield* fetchJSON(url, {id, progress}, {method: "POST"});
    });
}


function* completePhrase() {
    yield* takeEvery(COMPLETE_PHRASE, function* ({phraseId: id}) {
        yield* cancelSpeech();
        let url = "/training/working-set";
        let newPhrase = yield* fetchJSON(url, {id}, {method: "POST"});
        if (!newPhrase) return;
        yield put(addPhrase(newPhrase));
    });
}


function* speak() {
    yield* takeLatest(SPEAK, activateSpeech);
}


function* autoSpeak() {
    yield* takeLatest(COMPLETE_WORD, function* () {
        let completed = yield select(isCompleted);
        let prof = yield select(profile);
        if (completed && prof.autoSpeak) {
            yield* activateSpeech();
        }
    });
}


function* activateSpeech() {
    yield* cancelSpeech();
    let {targetText} = yield select(phrase);
    let utterance = new SpeechSynthesisUtterance(targetText);
    utterance.voice = getVoice();
    synth.speak(utterance);
    yield put(setProperty("pages.training.ui.speechIsActive", true));
    yield cps(cb => {utterance.onend = () => cb(null, true);});
    yield put(setProperty("pages.training.ui.speechIsActive", false));
}


function* cancelSpeech() {
    synth.cancel();
    yield put(setProperty("pages.training.ui.speechIsActive", false));
}



export default [
    fetchWorkingSet,
    passPhrase,
    completePhrase,
    speak,
    autoSpeak,
];

