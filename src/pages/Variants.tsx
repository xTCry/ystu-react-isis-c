import React from 'react';
import { Link } from 'react-router-dom';
import Varianter from '../components/variants/Varianter';

import '../styles/VariantsPreview.css';
import { csv_data } from '../csv_data';

class Variants extends React.Component {
    render() {
        return (
            <div className="playground">
                <div className="playgroundPreview">
                    <div className="previewArea">
                        <Varianter data={csv_data} />
                    </div>
                </div>
                <div className="playgroundCode">...</div>
            </div>
        );
    }
}

export default Variants;
