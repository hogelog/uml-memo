import { Button, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import * as React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { AppToaster } from "./Toaster";

export default class CopyableInput extends React.Component<{value: string}> {
    public state = {
        copied: false,
    };

    public render() {
        return (
            <>
                <input type="text" className="bp3-input"
                       value={this.props.value}
                       onChange={() => {
                           return this.setState({ copied: false });
                       }}
                />
                <CopyToClipboard text={this.props.value} onCopy={() => {
                    AppToaster.show({
                        message: this.props.value,
                        intent: Intent.PRIMARY,
                        icon: IconNames.CLIPBOARD,
                    });
                    this.setState({copied: true});
                }}>
                    <Button icon={IconNames.CLIPBOARD} />
                </CopyToClipboard>
            </>
        );
    }
}
