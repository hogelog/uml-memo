import * as React from "react";

import {Controlled as CodeMirror} from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

import "@blueprintjs/core/lib/css/blueprint.css";
import "normalize.css/normalize.css";

import "./App.scss";

import "./codemirror/plantuml";

import Preview from "./components/Preview";

export default class App extends React.Component<{}> {

    public state = {
        uml: "@startuml\nBob -> Alice : Hello\n@enduml",
    };
    private previewRef = React.createRef<Preview>();
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
                        viewportMargin: Infinity,
                    }}
                    onBeforeChange={(editor, data, value) => {
                        this.setState({uml: value});
                    }}
                    onChange={(editor, data, value) => {
                        if (this.previewRef.current) {
                            this.previewRef.current.updateUml();
                        }
                    }}
                />
                </div>
                <div id="preview">
                    <Preview uml={uml} ref={this.previewRef}/>
                </div>
            </div>
        );
    }
}
