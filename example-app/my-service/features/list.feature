Feature: Listing all users

  Rules:
  - returns all users currently stored


  Background:
    Given an ExoCom server
    And an instance of this service


  Scenario: no users exist in the database
    When receiving the message "list user"
    Then the service replies with "user list" and the payload:
      """
      []
      """


  Scenario: users exist in the database
    Given the service contains the users:
      | NAME |
      | one  |
      | two  |
    When receiving the message "list user"
    Then the service replies with "user list" and the payload:
      """
      [
        {
          "createdAt": "<timestamp>",
          "id": "<uuid>",
          "name": "one",
          "updatedAt": "<timestamp>"
        },
        {
          "createdAt": "<timestamp>",
          "id": "<uuid>",
          "name": "two",
          "updatedAt": "<timestamp>"
        }
      ]
      """
