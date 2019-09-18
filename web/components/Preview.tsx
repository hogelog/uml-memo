import * as React from 'react';
import { HTMLTable } from "@blueprintjs/core";

import CopyableInput from "./CopyableInput";

const host = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

export default class Preview extends React.Component<{uml: string}> {
    fetching = false;
    state = {
        baseUrl: host,
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
            let url = new URL(res.url);
            this.setState({ baseUrl: `${url.protocol}//${url.host}` });
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
    }

    render() {
        if (this.state.encodedUml.length == 0) {
            return (<div />);
        }

        let umlLink = `${this.state.baseUrl}/uml/source/${this.state.encodedUml}`;
        let imageLink = `${this.state.baseUrl}/uml/${this.state.encodedUml}`;
        return (
            <>
                <a href={imageLink} target="_blank" rel="noopener noreferrer"><img src={imageLink} /></a>
                <HTMLTable className="preview-table">
                    <tbody>
                    <tr>
                        <td className="preview-table-desc">Image URL</td>
                        <td>
                            <CopyableInput value={imageLink} />
                        </td>
                    </tr>
                    <tr>
                        <td className="preview-table-desc">Markdown</td>
                        <td>
                            <CopyableInput value={`![](${imageLink})`} />
                        </td>
                    </tr>
                    <tr>
                        <td className="preview-table-desc">UML URL</td>
                        <td>
                            <CopyableInput value={umlLink} />
                        </td>
                    </tr>
                    </tbody>
                </HTMLTable>
            </>
        );
    }
}
