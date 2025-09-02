Feature: Sign In Form Validation3
  @signin
  Scenario: Required fields must be filled
    Given I am on the Sign In page
    When I click Sign In without filling fields
    Then I should see an error message an "Email and password are required"
  @signin
  Scenario: Email input validation
    Given I am on the Sign In page
    Then the email input should be of type "email" and required
    @signin
  Scenario: Password input validation
    Given I am on the Sign In page
    Then the password input should be of type "password" and required
