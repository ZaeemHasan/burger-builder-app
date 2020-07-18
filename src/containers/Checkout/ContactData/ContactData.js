import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../../axios-orders';
import * as actions from '../../../store/actions/index';

import classes from './ContactData.module.css';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 4
                },
                valid: false,
                errorMessages: [],
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                errorMessages: [],
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5,
                    isNumeric: true
                },
                valid: false,
                errorMessages: [],
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                errorMessages: [],
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                errorMessages: [],
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' },
                    ]
                },
                value: 'fastest',
                validation: {},
                errorMessages: [],
                valid: true
            },
        },
        formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault();

        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        // // alert('You continue!')
        const order = {
            ingredients: this.props.ings,
            price: (+this.props.price).toFixed(2),  // convert to number, and accept value till two digits after decimal
            orderData: formData,
            userId: this.props.userId
        }

        this.props.onOrderBurger(order, this.props.token);
    }

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

    checkValidity(value, rules) {
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
    }

    inputChangedHandler = (event, inputIdentifier) => {
        console.log(event.target.value, inputIdentifier);
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        // updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);

        let containsErrors = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.valid = containsErrors.length === 0;
        updatedFormElement.errorMessages = containsErrors;

        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = formIsValid && updatedOrderForm[inputIdentifier].valid;
        }

        console.log(formIsValid, updatedFormElement);

        this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });

    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        errorMessages={formElement.config.errorMessages}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success" clicked={this.orderHandler} disabled={!this.state.formIsValid}>Order</Button>
            </form>
        );
        if (this.props.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));