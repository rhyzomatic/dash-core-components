import R from 'ramda';
import React, {Component, PropTypes} from 'react';
import ReactDropdown from 'react-select';

const DELIMETER = ',';

/**
 * Dropdown is an interactive dropdown element for selecting one or more
 * items.
 * The values and labels of the dropdown items are specified in the `options`
 * property and the selected item(s) are specified with the `value` property.
 *
 * Use a dropdown when you have many options (more than 5) or when you are
 * constrained for space. Otherwise, you can use RadioItems or a Checklist,
 * which have the benefit of showing the users all of the items at once.
 */
export default class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {value: props.value};
    }

    componentWillReceiveProps(newProps) {
        this.setState({value: newProps.value});
    }

    render() {
        const {id, fireEvent, multi, options, setProps} = this.props;
        const {value} = this.state;
        let selectedValue;
        if (R.type(value) === 'array') {
            selectedValue = value.join(DELIMETER);
        } else {
            selectedValue = value;
        }
        return (
            <div id={id}>
                <ReactDropdown
                    options={options}
                    value={selectedValue}
                    onChange={selectedOption => {
                        if (multi) {
                            let value;
                            if (R.isNil(selectedOption)) {
                                value = []
                            } else {
                                value = R.pluck('value', selectedOption);
                            }
                            this.setState({value});
                            if (setProps) setProps({value});
                        } else {
                            let value;
                            if (R.isNil(selectedOption)) {
                                value = null
                            } else {
                                value = selectedOption.value;
                            }
                            this.setState({value});
                            if (setProps) setProps({value});
                        }
                        if (fireEvent) fireEvent('change');
                    }}
                    {...this.props}
                />
            </div>
        );
    }
}

Dropdown.propTypes = {
    id: PropTypes.string,

    className: PropTypes.string,

    /**
     * Whether or not the dropdown is "clearable", that is, whether or
     * not a small "x" appears on the right of the dropdown that removes
     * the selected value.
     */
    clearable: PropTypes.bool,

    /**
     * If true, the option is disabled
     */
    disabled: PropTypes.bool,

    /**
     * If true, the user can select multiple values
     */
    multi: PropTypes.bool,

    options: PropTypes.arrayOf(
        PropTypes.shape({
            disabled: PropTypes.bool,
            label: PropTypes.string,
            value: PropTypes.string
        })
    ),

    /**
     * The grey, default text shown when no option is selected
     */
    placeholder: PropTypes.string,

    /**
     * Whether to enable the searching feature or not
     */
    searchable: PropTypes.bool,

    /**
     * The value of the input. If `multi` is false (the default)
     * then value is just a string that corresponds to the values
     * provided in the `options` property. If `multi` is true, then
     * multiple values can be selected at once, and `value` is an
     * array of items with values corresponding to those in the
     * `options` prop.
     */
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]),

    /**
     * Dash-assigned callback that gets fired when the input changes
     */
    setProps: PropTypes.func,

    dashEvents: PropTypes.oneOf(['change'])
};

Dropdown.defaultProps = {
    clearable: true,
    disabled: false,
    multi: false,
    searchable: true
}
