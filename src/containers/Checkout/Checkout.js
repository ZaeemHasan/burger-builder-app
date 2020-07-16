import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from './ContactData/ContactData';

class Checkout extends Component {

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }


    render() {
        return (
            <div>
                <CheckoutSummary ingredients={this.props.ings}
                    onCheckoutCancelled={this.checkoutCancelledHandler}
                    onCheckoutContinued={this.checkoutContinuedHandler}
                ></CheckoutSummary>
                <Route path={this.props.match.url + '/contact-data'} component={ContactData} />
                {/* <Route path={this.props.match.url + '/contact-data'} render={(props) => <ContactData ingredients={this.props.ings} price={this.state.price} {...props} />} /> */}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients
    };
}

// const mapDispatchToProps = dispatch => { }   // not needed here

export default connect(mapStateToProps)(Checkout);