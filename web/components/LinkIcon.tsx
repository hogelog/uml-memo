import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import * as React from "react";

export default class CopyableInput extends React.Component<{href: string}> {
    public render() {
        return <a className="link-icon-anchor" href={this.props.href} target="_blank" rel="noopener noreferrer">
            <Icon icon={IconNames.LINK}/>
        </a>;
    }
}
