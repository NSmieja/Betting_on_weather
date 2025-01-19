# Weather betting
This app allows user to bet on the weather conditions in a selected city.
At MVP 2.0, the user can bet on three markets:
- Rain 
- Clouds
- Fog 


## App functionalities
- Bet on weather condition for a given city up to the amount of cash in the wallet
- Initlal wallet of $100 (+ unlimited top-up of $50 each)
- Cash out option if bet amount is > $50 and winning odds are > 1.5
- Market freeze if bet amount is > $90 and winning odds are > 1.5 
- Receive a gift (one-time) after wallet balance will drop below $20

Notes: 
- Odds are generated randomly, there is no model for calculating weather probability.
- Higher odds are for the markets with incorrect weather prediction (current weather is fetched from the API). 
- After 5th bet, odds may be flipped (so that the user not always receive lower odds for winning market) - switch between odds is random.


## Weather API
The application uses current weather conditions from the following open source API:
- [Current day weather forecast](https://openweathermap.org/current) 


## Playwright tests
To run the tests on your local computer, follow the instructions:
1) open terminal and run command:
- npx http-server *folder/location/to/html/file* -p 8080 
  - (here: npx http-server app -p 8080)
2) open a second terminal and run the command: 
- npx playwright test


# Enjoy!