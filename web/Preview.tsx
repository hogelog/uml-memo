import * as React from 'react';

const endpoint = (process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '') + '/uml/image';

console.log(endpoint);
export default class Preview extends React.Component<{uml: string}> {
    render() {
        const { uml } = this.props;

        return (
            <div>
                <a href={`${endpoint}?uml=${encodeURIComponent(uml)}`}>
                    {`${endpoint}?uml=${encodeURIComponent(uml)}`}
                </a>
                <br />
                <img src={`${endpoint}?uml=${encodeURIComponent(uml)}`} />
            </div>
        );
    }
}
