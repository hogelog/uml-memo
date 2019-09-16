import * as React from 'react';
import {EditableText, HTMLTable} from "@blueprintjs/core";

const host = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

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
                            <EditableText selectAllOnFocus={true} defaultValue={imageLink} />
                        </td>
                    </tr>
                    <tr>
                        <td>Markdown</td>
                        <td>
                            <EditableText selectAllOnFocus={true} defaultValue={`![](${imageLink})`} />
                        </td>
                    </tr>
                    <tr>
                        <td>UML URL</td>
                        <td>
                            <EditableText selectAllOnFocus={true} defaultValue={`![](${umlLink})`} />
                        </td>
                    </tr>
                    </tbody>
                </HTMLTable>
            </>
        );
    }
}
