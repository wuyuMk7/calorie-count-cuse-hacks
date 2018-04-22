'use strict';

function avg(arr){
    if (arr == undefined || arr.length == 0)
        return 0;

    let sum = 0;

    for (let num of arr) {
        sum += parseInt(num);
    }

    return Math.ceil(sum / arr.length);
};

((food) => {
    const fatSecret = require('fatsecret');

    const key = '51cecc66d4f54ad38fdf26b49971af0c';
    const secret = '97286654e3e44a0689aa2ea3c25bcdec';
    
    const client = new fatSecret(key, secret);
    return client.method('foods.search', {
        search_expression: food,
        max_results: 3
    })
        .then((res) => {
            if (res.foods.total_results <= 0)
                return Promise.reject('None');

            let foods = res.foods.food;
            let calories = [];
            let weights = [];

            for (let eachFood of foods) {
                let desc = eachFood.food_description;
                let weight = desc.match(/Per (\d+)/);
                let calorie = desc.match(/- Calories: (\d+)/);

                console.log(desc);

                weights.push(weight[1]);
                calories.push(calorie[1]);
            }

            return Promise.resolve({ weight: avg(weights), calorie: avg(calories) });
        });
})('apple')
    .then((res) => {
        console.log(res);
    })
    .catch((err)=> {
        if (err == 'None') {
            console.log('00000');
        } else {
            console.log(err);            
        }
    });
