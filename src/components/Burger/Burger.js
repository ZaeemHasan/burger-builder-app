import React from 'react';

import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import classes from './Burger.module.css';

const burger = props => {
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            // console.log(igKey);
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                // console.log(igKey, i);
                return <BurgerIngredient key={igKey + i} type={igKey} />;
            });
        })
        .reduce((arr, el) => arr.concat(el), []);

    console.log(transformedIngredients);
    if (transformedIngredients.length == 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>;
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
}

export default burger;