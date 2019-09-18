import * as React from "react";

import {Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
// @ts-ignore
import QueryString from "query-string";
import {Controlled as CodeMirror} from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

import "@blueprintjs/core/lib/css/blueprint.css";
import "normalize.css/normalize.css";

import "./App.scss";

import "./codemirror/plantuml";

import Preview from "./components/Preview";
import {AppToaster} from "./components/Toaster";
import Timer = NodeJS.Timer;

const host = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "";
const editor_delay = 500;

export default class App extends React.Component<{}> {
    private changeTimer? : Timer;
    public state = {
        baseUrl : "",
        encodedUml: "",
        uml: "@startuml\nBob -> Alice : Hello\n@enduml",
    };

    public componentDidMount() {
        const params = QueryString.parse(location.search);
        if (params.uml) {
            const form = new FormData();
            form.append("uml", params.uml);
            fetch(`${host}/api/uml/decode`, {
                method: "POST",
                body: form,
                mode: "cors",
            }).then((res) => {
                return res.json();
            }).then((data) => {
                this.setState({ uml: data.decoded });
            }).catch((e) => {
                AppToaster.show({
                    message: e.message,
                    intent: Intent.DANGER,
                    icon: IconNames.ERROR,
                });
            });
        } else {
            this.updateUml();
        }
    }

    public render() {
        return (
            <div id="app">
                <div id="editor">
                    <CodeMirror
                        value={this.state.uml}
                        options={{
                            mode: "plantuml",
                            lineNumbers: true,
                            theme: "material",
                        }}
                        onBeforeChange={(editor, data, value) => {
                            this.setState({uml: value});
                        }}
                        onChange={(editor, data, value) => {
                            if (this.changeTimer) {
                                clearTimeout(this.changeTimer);
                                this.changeTimer = undefined;
                            }
                            this.changeTimer = setTimeout(() => {
                                this.updateUml();
                            }, editor_delay);
                        }}
                    />
                </div>
                <div id="preview">
                    <Preview
                        apiHost={this.state.baseUrl}
                        editorHost={`${location.protocol}//${location.host}`}
                        uml={this.state.encodedUml}
                    />
                </div>
            </div>
        );
    }

    private updateUml() {
        const form = new FormData();
        form.append("uml", this.state.uml);

        return fetch(`${host}/api/uml/encode`, {
            method: "POST",
            body: form,
            mode: "cors",
        }).then((res) => {
            const url = new URL(res.url);
            this.setState({ baseUrl: `${url.protocol}//${url.host}` });
            return res.json();
        }).then((data) => {
            this.setState({ encodedUml: data.encoded });
        }).catch((e) => {
            AppToaster.show({
                message: e.message,
                intent: Intent.DANGER,
                icon: IconNames.ERROR,
            });
        });
    }
}
