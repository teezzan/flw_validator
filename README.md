# flw_validator

flw_validator is the solution to Flutterwave coding assessment. 

## Usage
A live deployment of the codebase can be found on heroku `flw-validator.herokuapp.com`.

It has two active endpoints, the base endpoint `/` and `/validate-rule`. The former returns my contact details while the latter is used for carrying out basic validation of variables. 

A JSON of the form

```json
{
  "rule": {
    "field": "missions",
    "condition": "gte",
    "condition_value": 30
  },
  "data": {
    "name": "James Holden",
    "crew": "Rocinante",
    "age": 34,
    "position": "Captain",
    "missions": 45
  }
}

```
is sent as a payload of a `POST` request to `flw-validator.herokuapp.com/validate-rule` and a response of the form 
```json
{
  "message": "field missions successfully validated.",
  "status": "success",
  "data": {
    "validation": {
      "error": false,
      "field": "missions",
      "field_value": 45,
      "condition": "gte",
      "condition_value: 30
    }
  }
}
```
is sent back. 
While the `rule` field is required and has to be of the form shown above, the `data` field either be
-  A valid JSON object 
-  A valid array
-  A string.

The allowed conditions in the `rule.condition` field are

- *eq*: Means the field value should be equal to the condition value 
- *neq*: Means the field value should not be equal to the condition value 
- *gt*: Means the field value should be greater than the condition value 
- *gte*: Means the field value should be greater than or equal to the condition value 
- *contains*: Means the field value should contain the condition value.

## Examples

### 1

```json

{
  "rule": {
    "field": "missions.count",
    "condition": "gte",
    "condition_value": 30
  },
  "data": {
    "name": "James Holden",
    "crew": "Rocinante",
    "age": 34,
    "position": "Captain",
    "missions": {
      count: 45,
      successful: 44,
      failed: 1
    }
  }
}
```


Response: (HTTP 200)
```json
{
  "message": "field missions.count successfully validated.",
  "status": "success",
  "data": {
    "validation": {
      "error": false,
      "field": "missions.count",
      "field_value": 45,
      "condition": "gte",
      "condition_value: 30
    }
  }
}
```


### 2
```json
{
  "rule": {
    "field": "0",
    "condition": "eq",
    "condition_value": "a"
  },
  "data": "damien-marley"
}

```

Response: (HTTP 400)

```json
{
  "message": "field 0 failed validation.",
  "status": "error",
  "data": {
    "validation": {
      "error": true,
      "field": "0",
      "field_value": "d",
      "condition": "eq",
      "condition_value: "a"
    }
  }
}
```
### 3

```json
{
  "rule": {
    "field": "5",
    "condition": "contains",
    "condition_value": "rocinante"
  },
  "data": ["The Nauvoo", "The Razorback", "The Roci", "Tycho"]
}
```

Response: (HTTP 400)

```json
{
  "message": "field 5 is missing from data.",
  "status": "error",
  "data": null
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. 

Let's learn together.
