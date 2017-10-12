Feature: Creating users

  Rules:
  - when successful, the service replies with "user created"
    and the created record
  - when there is an error, the service replies with "user not-created"
    and a message describing the error


  Background:
    Given an ExoCom server
    And an instance of this service


  Scenario: creating a valid user record
    When receiving the message "create user" with the payload:
      """
      { "name": "one" }
      """
    Then the service replies with "user created" and the payload:
      """
      {
        "createdAt": "<timestamp>",
        "id": "<uuid>",
        "name": "one",
        "updatedAt": "<timestamp>"
      }
      """
    And the service now contains the users:
      | NAME |
      | one  |
