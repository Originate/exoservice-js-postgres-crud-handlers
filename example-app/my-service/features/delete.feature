Feature: Deleting a user

  Rules:
  - when receiving "delete user",
    removes the user record with the given id
    and returns "user deleted"


  Background:
    Given an ExoCom server
    And an instance of this service
    And the service contains the users:
      | NAME |
      | one  |
      | two  |


  Scenario: deleting an existing user
    When receiving the message "delete user" with the payload:
      """
      { "id": "<uuid of one>" }
      """
    Then the service replies with "user deleted" and the payload:
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
      | two  |


  Scenario: trying to delete a non-existing user
    When receiving the message "delete user" with the payload:
      """
      { "id": "zonk" }
      """
    Then the service replies with "user not-found"
    And the service now contains the users:
      | NAME |
      | one  |
      | two  |
