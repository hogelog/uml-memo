import * as React from 'react';

import {Controlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import Preview from "./Preview";

export default class App extends React.Component<{}> {
    public state = {
        uml: "@startuml\nBob -> Alice : hello\n@enduml"
    };
    render() {
        const { uml } = this.state;

        return (
            <div>
                <CodeMirror
                    value={this.state.uml}
                    options={{
                        mode: 'plain',
                        theme: 'material',
                        lineNumbers: true
                    }}
                    onBeforeChange={(editor, data, value) => {
                        this.setState({uml: value});
                    }}
                />
                <Preview uml={uml}/>
            </div>
        );
    }
}
