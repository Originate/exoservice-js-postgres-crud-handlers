Feature: Updating a user

  Rules:
  - when receiving "update user",
    updates the user record with the given id
    and returns "user updated" with the new record


  Background:
    Given an ExoCom server
    And an instance of this service
    And the service contains the users:
      | NAME |
      | one  |
      | two  |


  Scenario: updating an existing user
    When receiving the message "update user" with the payload:
      """
      {
        "id": "<uuid of one>",
        "name": "number one"
      }
      """
    Then the service replies with "user updated" and the payload:
      """
      {
        "createdAt": "<timestamp>",
        "id": "<uuid>",
        "name": "number one",
        "updatedAt": "<timestamp>"
      }
      """
    And the service now contains the users:
      | NAME       |
      | number one |
      | two        |


  Scenario: trying to update a non-existing user
    When receiving the message "update user" with the payload:
      """
      {
        "id": "zero",
        "name": "a total zero"
      }
      """
    Then the service replies with "user not-found"
    And the service now contains the users:
      | NAME |
      | one  |
      | two  |
