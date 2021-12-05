# Contact Tracing App for Canada

Authored by `Tianyi Kenny Chen`, `Shu Hong Chan`, `Thitikorn Pongmorrakot`, `Marjan Moshfegh Gohari`

## Demo

<img src=https://user-images.githubusercontent.com/31029660/144733581-ef1a7f56-eab7-4a7d-9aff-621d8b623f1a.gif width="300"/>

## Description

In order to slow the spread of COVID-19, people should take proactive action (such as doing COVID-19 testing) if they have come into close contact with someone diagnosed with COVID-19. The purpose of this app is to help people record the location they have visited, such as restaurants, shops, or theaters, and users will get an alert if there is a confirmed COVID-19 case at the venue which users have visited in the past 14 days.

## How it works
- Automatically record the current location.
- Scan the QR-code of the postal code when users arrive at a venue, e.g., restaurant.
- Visited Locations will be stored on mobile devices as postal codes with timestamps.
- Epidemic centers that are represented by postal codes will be pushed to devices so that each device can check if the user is exposed without sharing sensitive information.
- The app is planned to support fetching epidemic centers actively, but that’s not a part of the demonstration as it requires us to build a backend.
- Once a "visited" record matches an epidemic center, users will see an alert on the homepage with advice about COVID-19 testing.
- Our app can store your Vaccine Card and ID Card locally which makes it easy to show them to others.
- You can use the "Look Up" function to see if there are any epidemic centers around you, to keep you safe and sound.
