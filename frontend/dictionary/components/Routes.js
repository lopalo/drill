import React from "react";
import {Route} from "react-router";

import Dictionary from "./Dictionary";
import PhraseEditor from "./PhraseEditor";
import GroupsEditor from "./GroupsEditor";


export default () => (
  <Route path="dictionary" component={Dictionary}>
    <Route path="edit/:phraseId" component={PhraseEditor} />
    <Route path="create-phrase" component={PhraseEditor} />
    <Route path="edit-groups" component={GroupsEditor} />
  </Route>
);
