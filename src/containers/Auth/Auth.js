import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

import classes from './Auth.module.css';

import * as actions from '../../store/actions/index';


class Auth extends Component {

    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
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
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                errorMessages: [],
                touched: false
            }
        },
        formIsValid: false,
        isSignup: false
    };

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }

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

    inputChangedHandler = (event, controlName) => {
        console.log(event.target.value, controlName);
        const updatedControls = {
            ...this.state.controls
        };
        const updatedFormElement = {
            ...updatedControls[controlName]
        };
        updatedFormElement.value = event.target.value;
        // updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);

        let containsErrors = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.valid = containsErrors.length === 0;
        updatedFormElement.errorMessages = containsErrors;
        updatedFormElement.touched = true;

        updatedControls[controlName] = updatedFormElement;

        let formIsValid = true;
        for (let controlName in updatedControls) {
            formIsValid = formIsValid && updatedControls[controlName].valid;
        }

        console.log(formIsValid, updatedFormElement);

        this.setState({ controls: updatedControls, formIsValid: formIsValid });

    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return { isSignup: !prevState.isSignup };
        })
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let form = formElementsArray.map(formElement => (
            <Input key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                errorMessages={formElement.config.errorMessages}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event, formElement.id)} />
        ));

        if (this.props.loading) {
            form = <Spinner />
        }

        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (<p>{this.props.error.message}</p>);
        }

        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />;
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                <h1>{this.state.isSignup ? 'SIGNUP' : 'SIGNIN'}</h1>
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success" disabled={!this.state.formIsValid}>SUBMIT</Button>
                </form>
                <Button btnType="Danger" clicked={this.switchAuthModeHandler}>SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);