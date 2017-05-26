import {put, select, cps} from "redux-saga/effects";

import {
    REQUEST_WORKING_SET,
    COMPLETE_WORD,
    PASS_PHRASE,
    COMPLETE_PHRASE,
    SPEAK,
    updateWorkingSet
} from "./actions";
import {profile} from "../common/selectors";
import {isCompleted, workingSet, phrase} from "./selectors";
import {setProperty} from "../common/actions";
import {
    fetchJSON,
    takeEverySafely as takeEvery,
    takeLatestSafely as takeLatest
} from "../common/sagas";


const synth = window.speechSynthesis;
const getVoice = lang => {
    let name = "Google UK English Male";
    if (lang === "ru") {
        name = "Google русский";
    }
    return synth.getVoices().find(v => v.name === name);
};


function* fetchWorkingSet() {
    yield* takeLatest(REQUEST_WORKING_SET, function* () {
        let set = {};
        let queue = [];
        let data = yield* fetchJSON("/training/working-set");
        for (let i of data) {
            set[i.id] = i;
            queue.push(i.id);
        }
        yield put(setProperty("pages.training.workingSet", set));
        yield put(setProperty("pages.training.ui.ringQueue", queue));
    });
}


function* passPhrase() {
    yield* takeEvery(
        PASS_PHRASE,
        function* ({phraseId: id, progress}) {
            yield* cancelSpeech();
            let completed = (yield select(workingSet))[id].isCompleted;
            let url = "/training/increment-progress";
            if (!progress || completed) return;
            //yield* fetchJSON(url, {id, progress}, {method: "POST"});
        }
    );
}


function* completePhrase() {
    yield* takeEvery(COMPLETE_PHRASE, function* ({phraseId: id}) {
        yield* cancelSpeech();
        let url = "/training/working-set";
        let newWorkingSet = yield* fetchJSON(url, {id}, {method: "POST"});
        yield put(updateWorkingSet(newWorkingSet));
    });
}


function* speak() {
    yield* takeLatest(SPEAK, ({text}) => activateSpeech(text));
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


function* activateSpeech(text=null) {
    yield* cancelSpeech();
    let prof = yield select(profile);
    let lang = prof.speakLanguage;
    if (!text) {
        let {
            sourceLang,
            targetLang,
            sourceText,
            targetText
        } = yield select(phrase);
        if (sourceLang === lang) {
            text = sourceText;
        }
        if (targetLang === lang) {
            text = targetText;
        }
    }
    if (!text) return;
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = getVoice(lang);
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

