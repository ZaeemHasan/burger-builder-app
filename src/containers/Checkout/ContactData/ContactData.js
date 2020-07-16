import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

import axios from '../../../axios-orders';

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
                    maxLength: 5
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
                    required: true
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
        loading: false,
        formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        console.log(this.props.ingredients);

        this.setState({ loading: true });

        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        // // alert('You continue!')
        const order = {
            ingredients: this.props.ingredients,
            price: (+this.props.price).toFixed(2),  // convert to number, and accept value till two digits after decimal
            orderData: formData
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false });
                console.log(response);
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({ loading: false });
                console.log(error);
            });
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
                errorMessages.push(`Value must be have atleast ${rules.minLength} characters`);
        }

        if (rules.maxLength) {
            if (value.trim().length > rules.maxLength)
                errorMessages.push(`Value must be have atmost ${rules.maxLength} characters`);
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
        if (this.state.loading) {
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

export default ContactData;