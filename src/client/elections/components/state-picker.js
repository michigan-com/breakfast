
import React, { Component } from 'react';

import Select from '../../util/components/select';

export default class StatePicker extends Select {

    getStyle(option) {
        return {
            fontFamily: 'StateFaceRegular'
        }
    }

    getDisplayValue(option) {
        return option.displayValue;
    }
}
