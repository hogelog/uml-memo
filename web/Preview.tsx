import * as React from 'react';

const endpoint = (process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '') + '/uml/image';

export default class Preview extends React.Component<{uml: string}> {
    render() {
        const { uml } = this.props;

        let url = `${endpoint}?uml=${encodeURIComponent(uml)}`;
        return (
            <div>
                <a href={url}>{url}</a>
                <br />
                <img src={url} />
            </div>
        );
    }
}
