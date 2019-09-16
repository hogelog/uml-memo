import * as React from 'react';
import {Button, HTMLTable, Popover} from "@blueprintjs/core";
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { IconNames } from "@blueprintjs/icons";

const host = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

class CopyableInput extends React.Component<{id: string, value: string}> {
    state = {
        value: this.props.value,
        copied: false,
    };

    render() {
        return (
            <>
                <input type="text" className="bp3-input bp3-fill" id={this.props.id}
                       defaultValue={this.props.value}
                       onChange={({target: {value}}) => this.setState({value, copied: false})}
                />
                <CopyToClipboard text={this.state.value}
                                 onCopy={() => this.setState({copied: true})}>
                    <Button icon={IconNames.CLIPBOARD} />
                </CopyToClipboard>
            </>
        );
    }
}

export default class Preview extends React.Component<{uml: string}> {
    fetching = false;
    state = {
        encodedUml: "",
    };

    updateUml() {
        if (this.fetching) return;
        this.fetching = true;

        let form = new FormData();
        form.append("uml", this.props.uml)

        return fetch(`${host}/api/uml`, {
            method: 'POST',
            body: form,
            mode: "cors",
        }).then((res) => {
            return res.json();
        }).then((data) => {
            this.fetching = false;
            this.setState({ encodedUml: data.encoded });
        }).catch((e) => {
            console.log(e);
        });
    }

    componentDidMount() {
        this.updateUml();
        //let clipboard = new ClipboardJS('.clipboard-btn');
    }

    render() {
        if (this.state.encodedUml.length == 0) {
            return (<div />);
        }

        let umlLink = `${host}/uml/source/${this.state.encodedUml}`;
        let imageLink = `${host}/uml/${this.state.encodedUml}`;
        return (
            <>
                <img src={imageLink} />
                <HTMLTable>
                    <tbody>
                    <tr>
                        <td>Image URL</td>
                        <td>
                            <CopyableInput id="image-link" value={imageLink} />
                        </td>
                    </tr>
                    <tr>
                        <td>Markdown</td>
                        <td>
                            <CopyableInput id="image-markdown" value={`![](${imageLink})`} />
                        </td>
                    </tr>
                    <tr>
                        <td>UML URL</td>
                        <td>
                            <CopyableInput id="uml-link" value={umlLink} />
                        </td>
                    </tr>
                    </tbody>
                </HTMLTable>
            </>
        );
    }
}
