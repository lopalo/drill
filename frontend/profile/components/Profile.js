import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";

import {languages} from "../../common/constants";
import {profile} from "../../common/selectors";
import {setField} from "../actions";


const ProfileEditor = ({profile, setField}) => {
    let changeField = fieldName => e => setField(fieldName, e.target.value);
    return (
      <div className="col-md-6 col-md-offset-3">
        <form className="form-horizontal">
          <div className="text-center">
            <legend>Profile Settings</legend>
          </div>
          <div className="form-group">
            <label className="col-md-4 control-label">Working set size</label>
            <div className="col-md-6">
              <input
                value={profile.workingSetSize}
                onChange={changeField("workingSetSize")}
                type="number"
                step="1" min="5" max="15"
                className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-4 control-label">Repeats</label>
            <div className="col-md-6">
              <input
                value={profile.repeats}
                onChange={changeField("repeats")}
                type="number"
                step="1" min="1" max="30"
                className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-4 control-label">Completed repeat factor</label>
            <div className="col-md-6">
              <input
                value={profile.completedRepeatFactor}
                onChange={changeField("completedRepeatFactor")}
                type="number"
                step="0.05" min="0" max="1"
                className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-4 control-label">Speak language</label>
            <div className="col-md-6">
              <select className="form-control"
                      value={profile.speakLanguage}
                      onChange={changeField("speakLanguage")}>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
              <div className="col-md-offset-4 col-md-6">
                <div className="checkbox">
                  <label>
                    <input
                        type="checkbox"
                        checked={profile.autoSpeak}
                        onChange={e => setField("autoSpeak", e.target.checked)} />
                        Auto speak
                  </label>
                </div>
              </div>
          </div>
        </form>
      </div>
    );
};

const mapStateToProps = createStructuredSelector({profile});
const mapDispatchToProps = (
    dispatch
) => bindActionCreators({
    setField
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileEditor);



