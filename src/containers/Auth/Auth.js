import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';

import classes from './Auth.module.css';



const Auth = props => {

    const [authForm, setAuthForm] = useState({
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
    });
    const [formIsValid, setFormIsValid] = useState(false);
    const [isSignup, setIsSignup] = useState(false);

    const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;

    useEffect(() => {
        if (!buildingBurger && authRedirectPath !== '/') {
            onSetAuthRedirectPath();
        }
    }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

    const inputChangedHandler = (event, controlName) => {

        let containsErrors = checkValidity(event.target.value,
            authForm[controlName].validation);

        const updatedControls = updateObject(authForm, {
            [controlName]: updateObject(authForm[controlName], {
                value: event.target.value,
                valid: containsErrors.length === 0,
                errorMessages: containsErrors,
                touched: true
            })
        });

        let formIsValid = true;
        for (let controlName in updatedControls) {
            formIsValid = formIsValid && updatedControls[controlName].valid;
        }

        setAuthForm(updatedControls);
        setFormIsValid(formIsValid);

    }

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(authForm.email.value, authForm.password.value, isSignup);
    }

    const switchAuthModeHandler = () => {
        setIsSignup(!isSignup);
    }

    const formElementsArray = [];
    for (let key in authForm) {
        formElementsArray.push({
            id: key,
            config: authForm[key]
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
            changed={(event) => inputChangedHandler(event, formElement.id)} />
    ));

    if (props.loading) {
        form = <Spinner />
    }

    let errorMessage = null;
    if (props.error) {
        errorMessage = (<p>{props.error.message}</p>);
    }

    let authRedirect = null;
    if (props.isAuthenticated) {
        authRedirect = <Redirect to={props.authRedirectPath} />;
    }

    return (
        <div className={classes.Auth}>
            {authRedirect}
            <h1>{isSignup ? 'SIGNUP' : 'SIGNIN'}</h1>
            {errorMessage}
            <form onSubmit={submitHandler}>
                {form}
                <Button btnType="Success" disabled={!formIsValid}>SUBMIT</Button>
            </form>
            <Button btnType="Danger" clicked={switchAuthModeHandler}>SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
        </div>
    );

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