import { FC, useState } from 'react';
import { useParams } from 'react-router';

import { Variant1 } from './Variant1';
import { Variant2 } from './Variant2';
import { Variant3 } from './Variant3';
import { Variant4 } from './Variant4';
import { Variant5 } from './Variant5';
import { Variant6 } from './Variant6';
import { Variant7 } from './Variant7';

const variants = [Variant1, Variant2, Variant3, Variant4, Variant5, Variant7, Variant6];

const VariantSelect = ({ currentValue, values, onChange }) => (
    <select onChange={onChange} value={currentValue} style={{ width: 75 }}>
        {values.map((value, index) => (
            <option value={index} key={value}>
                {value.name}
            </option>
        ))}
    </select>
);

const CreateElement = (Comp, props) => <Comp {...props} />;

const Varianter: FC<{ data: any[] }> = ({ children, ...props }) => {
    const { variant: _variant } = useParams<{ variant }>();
    const [variant, setVariant] = useState(_variant || 0);

    return (
        <>
            <h1>V: {_variant}</h1>
            <VariantSelect
                currentValue={variant}
                values={variants}
                onChange={(event) => setVariant(event.target.value)}
            />

            {CreateElement(variants[variant], props)}
        </>
    );
};

export default Varianter;
