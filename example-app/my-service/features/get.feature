Feature: Get details for a user

  Rules:
  - when receiving "get user",
    returns "user details" with details for the given user


  Background:
    Given an ExoCom server
    And an instance of this service
    And the service contains the users:
      | NAME |
      | one  |
      | two  |


  Scenario: locating an existing user by id
    When receiving the message "get user" with the payload:
      """
      {
        "id": "<uuid of one>"
      }
      """
    Then the service replies with "user details" and the payload:
      """
      {
        "createdAt": "<timestamp>",
        "id": "<uuid>",
        "name": "one",
        "updatedAt": "<timestamp>"
      }
      """


  Scenario: locating a non-existing user by id
    When receiving the message "get user" with the payload:
      """
      {
        "id": "zonk"
      }
      """
    Then the service replies with "user not-found"
