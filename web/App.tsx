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

const host = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "";

export default class App extends React.Component<{}> {
    public state = {
        uml: "@startuml\nBob -> Alice : Hello\n@enduml",
    };
    private previewRef = React.createRef<Preview>();

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
        }
    }

    public render() {
        const { uml } = this.state;

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
                        this.updateUml();
                        //if (this.previewRef.current) {
                        //    this.previewRef.current.updateUml();
                        //}
                    }}
                    editorDidMount={(editor) => {
                        this.updateUml();
                    }}
                />
                </div>
                <div id="preview">
                    <Preview host={host} uml={uml} ref={this.previewRef}/>
                </div>
            </div>
        );
    }

    private updateUml() {
        if (this.previewRef.current) {
            this.previewRef.current.updateUml();
        }
    }
}
