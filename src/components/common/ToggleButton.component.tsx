import * as React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Button } from 'shards-react';

export type ToggleButtonType = 'checkbox' | 'radio';

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
    active?: boolean;
    variant?: any;
    size?: 'sm' | 'lg';
    type?: any;
    href?: string;
    disabled?: boolean;
    target?: any;
}

export interface ToggleButtonProps extends ButtonProps {
    type?: ToggleButtonType;
    name?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    value: string | ReadonlyArray<string> | number;
    inputRef?: React.Ref<HTMLInputElement>;
}

const noop = () => undefined;

const propTypes = {
    /**
     * The `<input>` element `type`
     */
    type: PropTypes.oneOf<ToggleButtonType>(['checkbox', 'radio']),

    /**
     * The HTML input name, used to group like checkboxes or radio buttons together
     * semantically
     */
    name: PropTypes.string,

    /**
     * The checked state of the input, managed by `<ToggleButtonGroup>` automatically
     */
    checked: PropTypes.bool,

    /**
     * The disabled state of both the label and input
     */
    disabled: PropTypes.bool,

    /**
     * `id` is required for button clicks to toggle input.
     */
    id: PropTypes.string.isRequired,

    /**
     * A callback fired when the underlying input element changes. This is passed
     * directly to the `<input>` so shares the same signature as a native `onChange` event.
     */
    onChange: PropTypes.func,

    /**
     * The value of the input, should be unique amongst it's siblings when nested in a
     * `ToggleButtonGroup`.
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string.isRequired), PropTypes.number])
        .isRequired,

    /**
     * A ref attached to the `<input>` element
     * @type {ReactRef}
     */
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.any]),
};

const ToggleButton = React.forwardRef<HTMLLabelElement, ToggleButtonProps>(
    ({ name, className, checked, type, onChange, value, disabled, id, inputRef, ...props }, ref) => {
        return (
            <>
                <input
                    className={'btn-check'}
                    name={name}
                    type={type}
                    value={value}
                    ref={inputRef}
                    autoComplete="off"
                    checked={!!checked}
                    disabled={!!disabled}
                    onChange={onChange || noop}
                    id={id}
                />
                <Button
                    {...props}
                    ref={ref}
                    className={classNames(className, disabled && 'disabled')}
                    type={undefined}
                    as="label"
                    htmlFor={id}
                />
            </>
        );
    }
);

ToggleButton.propTypes = propTypes;
ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;
