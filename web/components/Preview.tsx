import {HTMLSelect, HTMLTable} from "@blueprintjs/core";
import * as Cookies from "js-cookie";
import * as React from "react";

import CopyableInput from "./CopyableInput";
import LinkIcon from "./LinkIcon";

const IMAGE_FORMATS = ["png", "svg"];

export default class Preview extends React.Component<{apiHost: string, editorHost: string, uml: string}> {
    public state = {
        format: Cookies.get("format") || "png",
    };

    public render() {
        if (this.props.uml.length === 0) {
            return <div />;
        }

        const ext = this.state.format === "png" ? "" : `.${this.state.format}`;
        const umlLink = `${this.props.apiHost}/uml/source/${this.props.uml}`;
        const imageLink = `${this.props.apiHost}/uml/${this.props.uml}${ext}`;
        const shareLink = `${this.props.editorHost}/?uml=${this.props.uml}`;
        const options = IMAGE_FORMATS.map((format) => {
            return (
                <option value={format} key={format}>
                    {format.toUpperCase()}
                </option>
            );
        });
        return (
            <>
                <a href={imageLink} target="_blank" rel="noopener noreferrer"><img src={imageLink} /></a>
                <div className="preview-format-selector">
                    <HTMLSelect
                        defaultValue={this.state.format}
                        onChange={(event) => {
                            const format = event.target.selectedOptions[0].value;
                            Cookies.set("format", format);
                            this.setState({ format });
                        }}
                    >
                        {options}
                    </HTMLSelect>
                </div>
                <HTMLTable className="preview-table">
                    <tbody>
                    <tr>
                        <td className="preview-table-desc">
                            Image URL
                            <LinkIcon href={imageLink} />
                        </td>
                        <td>
                            <CopyableInput value={imageLink} />
                        </td>
                    </tr>
                    <tr>
                        <td className="preview-table-desc">
                            Markdown
                        </td>
                        <td>
                            <CopyableInput value={`![](${imageLink})`} />
                        </td>
                    </tr>
                    <tr>
                        <td className="preview-table-desc">
                            UML URL
                            <LinkIcon href={umlLink} />
                        </td>
                        <td>
                            <CopyableInput value={umlLink} />
                        </td>
                    </tr>
                    <tr>
                        <td className="preview-table-desc">
                            Share
                            <LinkIcon href={shareLink} />
                        </td>
                        <td>
                            <CopyableInput value={shareLink} />
                        </td>
                    </tr>
                    </tbody>
                </HTMLTable>
            </>
        );
    }
}
