# Weather betting
This app allows user to bet on the weather conditions in a selected city.
At MVP 1.0, the user can bet two markets:
- Rain
- No rain

## App functionalities
- Initlal wallet of $100 (+ unlimited top-up of $50 each)
- Bet on rain / no rain for a given city
- Cash out option if bet amount is > $50 and winning odds are > 1.5
- Market freeze if bet amount is > $90 and winning odds are > 1.5 
- Receive a gift (one-time) after wallet balance will drop below $20

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