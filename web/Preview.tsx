import * as React from 'react';

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
            <div>
                <dl>
                    <dt>Image:</dt>
                    <dd>
                        <a href={imageLink}>
                            <img src={imageLink} />
                            <br />
                            {imageLink}
                        </a>
                    </dd>
                    <dt>Source:</dt>
                    <dd><a href={umlLink}>{umlLink}</a></dd>
                </dl>
            </div>
        );
    }
}
