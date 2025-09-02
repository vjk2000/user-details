Feature: Sign Up Form Validation
    @signup
  Scenario: Required fields must be filled
    Given I am on the Sign Up page
    When I click Sign Up without filling fields
    Then I should see an error message "All fields are required"
    @signup
  Scenario: Invalid email format
    Given I am on the Sign Up page
    When I fill name "Test User" and email "invalid-email" and password "password123"
    Then the email field should require a valid format
    @signup
  Scenario: Password too short
    Given I am on the Sign Up page
    When I fill name "Test User" and email "test@example.com" and password "123"
    Then the password field should enforce minimum length of "6"
    @signup
  Scenario: Clear validation errors when input changes
    Given I am on the Sign Up page
    When I submit empty form
    Then I should see a validation error
    When I type "T" into the name field
    Then the error message should disappear


#   Scenario: Successful signup
#     Given I am on the Sign Up page
#     When I enter name "krishna", email "krishna@example.com", and password "krishna123"
#     And I click Sign Up
#     Then I should see a success message "Account created successfully! Redirecting to sign in..." 


