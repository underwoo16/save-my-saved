
# Save My Saved

Simple command line tool to export your saved links from reddit.


## Dependencies

[Node.js](https://nodejs.org/en/)

    
## Usage

+ Gather reddit API credentials
    - Go to https://www.reddit.com/prefs/apps and login to your reddit account
    - Click 'create new app' or 'create another app' button
    - Name your app (any name is fine) and select `Script` type. Put anything in the description, about url, and redirect url fields
    - Click `create app` and make note of the `client_id` (right below app name and personal use script) and the `secret_id`
    - Open `src/index.js` and fill in your `client_id`, `secret_id`, `username`, and `password` variables near the top of the file
+ Install dependencies
    - Run `npm install`
+ Run the script!
    -  execute `node src/index.js`

You should now have a comma separated file (csv) of all of your saved posts

