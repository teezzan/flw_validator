const express = require('express')
const app = express()
const port = 3000 || proces.env.PORT;

const bodyParser = require('body-parser');

app.use((req, res, next) => {
    bodyParser.json()(req, res, err => {

        if (err && req.method !== 'GET') {
            // console.error(err);
            return res.status(400).json({
                message: "Invalid JSON payload passed.",
                status: "error",
                data: null
            });
        }
        next();
    });
});

let my_data = {
    name: "Taiwo Yusuf",
    github: "@teezzan",
    email: "teehazzan@gmail.com",
    mobile: "08168494355",
    twitter: "@HW_Kage"
}

let ops = ['eq', 'neq', 'gt', 'gte', 'contains']

function hasOwnProperty(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

function return_success(res, field_name, field_value, rule_condition, condition_value) {

    let output = {
        message: `field ${field_name} successfully validated.`,
        status: "success",
        data: {
            validation: {
                error: false,
                field: `${field_name}`,
                field_value: `${field_value}`,
                condition: `${rule_condition}`,
                condition_value: `${condition_value}`
            }
        }
    }

    res.status(200).json(output)
}

function return_error(res, field_name, field_value, rule_condition, condition_value) {

    let output = {
        message: `field ${field_name} failed validation.`,
        status: "error",
        data: {
            validation: {
                error: true,
                field: `${field_name}`,
                field_value: `${field_value}`,
                condition: `${rule_condition}`,
                condition_value: `${condition_value}`
            }
        }
    }

    res.status(400).json(output)
}

function return_result(res, result, field_name, field_value, rule_condition, condition_value) {
    if (result) {
        return return_success(res, field_name, field_value, rule_condition, condition_value);
    }
    else {
        return return_error(res, field_name, field_value, rule_condition, condition_value)
    }
}

app.get('/', (req, res) => {

    let output = {
        message: "My Rule-Validation API",
        status: "success",
        data: my_data
    }
    res.status(200).json(output)
})



app.post('/validate-rule', (req, res) => {
    let body = req.body;
    //check the rule and data field
    if (!hasOwnProperty(body, "rule")) {
        let output = {
            message: "rule is required.",
            status: "error",
            data: null
        }

        return res.status(400).json(output)

    }

    if ((typeof (body.rule) !== 'object') || body.rule == null) {
        let output = {
            message: "rule should be an object.",
            status: "error",
            data: null
        }
        return res.status(400).json(output)
    }

    if (!hasOwnProperty(body, "data")) {
        let out = {
            message: "data is required.",
            status: "error",
            data: null
        }

        return res.status(400).json(out);

    }

    if ((typeof (body.data) !== 'object') && (typeof (body.data) !== 'string') || body.data == null) {
        let output = {
            message: "data should be an object, a string or an array.",
            status: "error",
            data: null
        }
        return res.status(400).json(output)
    }



    if (!hasOwnProperty(body.rule, "field")) {
        let out = {
            message: "rule.field is required.",
            status: "error",
            data: null
        }

        return res.status(400).json(out);
    }


    if (!hasOwnProperty(body.rule, "condition")) {
        let out = {
            message: "rule.condition is required.",
            status: "error",
            data: null
        }

        return res.status(400).json(out);
    }

    if (!hasOwnProperty(body.rule, "condition_value")) {
        let out = {
            message: "rule.condition_value is required.",
            status: "error",
            data: null
        }

        return res.status(400).json(out);
    }

    if ((typeof (body.rule.field) !== 'string')) {
        let output = {
            message: "rule.field should be a string.",
            status: "error",
            data: null
        }
        return res.status(400).json(output)
    }

    if (body.rule.field.split('.').length > 2) {
        let out = {
            message: "rule.field nesting should not be more than two levels.",
            status: "error",
            data: null
        }

        return res.status(400).json(out);
    }

    if (!ops.includes(body.rule.condition)) {
        let output = {
            message: "rule.condition should be 'eq', 'neq', 'gt', 'gte' or 'contains'.",
            status: "error",
            data: null
        }
        return res.status(400).json(output)
    }

    if (Array.isArray(body.data) || typeof (body.data) == 'string') {

        if ((body.data[body.rule.field] == undefined) && (!body.data.includes(undefined))) {

            let out = {
                message: `field ${body.rule.field} is missing from data.`,
                status: "error",
                data: null
            }

            return res.status(400).json(out);
        }

        if (body.rule.condition == 'eq') {
            let field_value = body.data[body.rule.field];
            let result = (field_value == body.rule.condition_value)
            return return_result(res, result, body.rule.field, field_value, body.rule.condition, body.rule.condition_value);
        }
        else if (body.rule.condition == 'neq') {
            let field_value = body.data[body.rule.field];
            let result = (field_value !== body.rule.condition_value)
            return return_result(res, result, body.rule.field, field_value, body.rule.condition, body.rule.condition_value);

        }
        else if (body.rule.condition == 'gte') {

            let field_value = body.data[body.rule.field];
            let result = (field_value >= body.rule.condition_value)
            return return_result(res, result, body.rule.field, field_value, body.rule.condition, body.rule.condition_value);

        }
        else if (body.rule.condition == 'gt') {
            let field_value = body.data[body.rule.field];
            let result = (field_value > body.rule.condition_value)
            return return_result(res, result, body.rule.field, field_value, body.rule.condition, body.rule.condition_value);

        }
        else if (body.rule.condition == 'contains') {
            let field_value = body.data[body.rule.field];
            let result = (field_value.includes(body.rule.condition_value))
            return return_result(res, result, body.rule.field, field_value, body.rule.condition, body.rule.condition_value);
        }

    }
    else {
        let nest = body.rule.field.split('.');
        let field_value;
        if (nest.length == 1) {
            field_value = body.data[nest[0]]
        }
        else {
            field_value = body.data[nest[0]][nest[1]]
        }
        if (field_value == undefined) {

            let out = {
                message: `field ${body.rule.field} is missing from data.`,
                status: "error",
                data: null
            }

            return res.status(400).json(out);
        }


        if (body.rule.condition == 'eq') {
            let result = (field_value == body.rule.condition_value)
            return return_result(res, result, body.rule.field, field_value, body.rule.condition, body.rule.condition_value);
        }
        else if (body.rule.condition == 'neq') {
            let result = (field_value !== body.rule.condition_value)
            return return_result(res, result, body.rule.field, field_value, body.rule.condition, body.rule.condition_value);

        }
        else if (body.rule.condition == 'gte') {

            let result = (field_value >= body.rule.condition_value)
            return return_result(res, result, body.rule.field, field_value, body.rule.condition, body.rule.condition_value);

        }
        else if (body.rule.condition == 'gt') {
            let result = (field_value > body.rule.condition_value)
            return return_result(res, result, body.rule.field, field_value, body.rule.condition, body.rule.condition_value);

        }
        else if (body.rule.condition == 'contains') {

            let result = (field_value.includes(body.rule.condition_value))
            return return_result(res, result, body.rule.field, field_value, body.rule.condition, body.rule.condition_value);
        }



    }


})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})