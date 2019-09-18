import { Button, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import * as React from "react";
// @ts-ignore
import { CopyToClipboard } from "react-copy-to-clipboard";
import { AppToaster } from "./Toaster";

export default class CopyableInput extends React.Component<{value: string}> {
    public state = {
        value: this.props.value,
        copied: false,
    };

    public render() {
        return (
            <>
                <input type="text" className="bp3-input"
                       defaultValue={this.props.value}
                       onChange={({target: {value}}) => this.setState({value, copied: false})}
                />
                <CopyToClipboard text={this.state.value} onCopy={() => {
                    AppToaster.show({
                        message: this.state.value,
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
