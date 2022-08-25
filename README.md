# VC and Angel data to Airtable

## ENV variables

API Key - get from Airtable Account page

BASE ID - choose the correct base from the list at https://airtable.com/api

### Step 1

Create a new base

### Step 2

Add the following fields to the base (case sensitive)

- Name
- URL
- address
- countries
- stages
- description
- entity
- minimum investment
- maximum investment
- LinkedIn

### Step 3

Use the following command to run the script
`npm start`

**IMPORTANT** ->
Running the script more then once will result in the duplicated data being added to Airtable. Either create a new base and update the ID or clear the base first before running it again.

### Optionally

The raw CSV files has more data then what is transferred to Airtable. The files are filteded in `index.js` in the respective function for each dataset.
