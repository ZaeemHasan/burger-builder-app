export const updateObject = (oldObject, updatedValues) => {
    return {
        ...oldObject,
        ...updatedValues
    };
}

export const checkValidity = (value, rules) => {
    let errorMessages = [];
    // just additional rule in cases where validation is not defined
    if (!rules) {
        return errorMessages
    }

    if (rules.required) {
        if (value.trim() === '')
            errorMessages.push(`Value is required`);
    }

    if (rules.minLength) {
        if (value.trim().length < rules.minLength)
            errorMessages.push(`Value must have atleast ${rules.minLength} characters`);
    }

    if (rules.maxLength) {
        if (value.trim().length > rules.maxLength)
            errorMessages.push(`Value must have atmost ${rules.maxLength} characters`);
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (!pattern.test(value))
            errorMessages.push(`Value must be an email`);
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        if (!pattern.test(value))
            errorMessages.push(`Value must be numeric`);
    }

    return errorMessages;
};

// old version of checkvalidity which doesnt gives all the errors as list
// checkValidity(value, rules) {
//     let isValid = true;

//     // just additional rule in cases where validation is not defined
//     if (!rules) {
//         return true;
//     }

//     if (rules.required) {
//         isValid = isValid && (value.trim() !== '');
//     }

//     if (rules.minLength) {
//         isValid = isValid && (value.trim().length >= rules.minLength);
//     }

//     if (rules.maxLength) {
//         isValid = isValid && (value.trim().length <= rules.maxLength);
//     }

// if (rules.isEmail) {
//     const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
//     isValid = pattern.test(value) && isValid
// }

// if (rules.isNumeric) {
//     const pattern = /^\d+$/;
//     isValid = pattern.test(value) && isValid
// }

//     return isValid;
// }