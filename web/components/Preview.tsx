import {HTMLTable} from "@blueprintjs/core";
import * as React from "react";

import CopyableInput from "./CopyableInput";
import LinkIcon from "./LinkIcon";

export default class Preview extends React.Component<{apiHost: string, editorHost: string, uml: string}> {
    public render() {
        if (this.props.uml.length === 0) {
            return <div />;
        }
        const umlLink = `${this.props.apiHost}/uml/source/${this.props.uml}`;
        const imageLink = `${this.props.apiHost}/uml/${this.props.uml}`;
        const shareLink = `${this.props.editorHost}/?uml=${this.props.uml}`;
        return (
            <>
                <a href={imageLink} target="_blank" rel="noopener noreferrer"><img src={imageLink} /></a>
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
