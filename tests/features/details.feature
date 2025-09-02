@userflow
Feature: User authentication and profile details
  @details
  Scenario: User signs in and fills personal details
    Given I am on the SignIn page
    When I enter email "ajith@gmail.com" and password "123456"
    And I click "Sign In"
    Then I should be redirected to the profile page

    When I navigate to the Details Form page
    And I enter my details:
      | age         | 28              |
      | gender      | male            |
      | phone       | 9876543210      |
      | address     | 123 Main Street |
      | city        | Chennai         |
      | state       | Tamil Nadu      |
      | postal_code | 600001          |
      | occupation  | Engineer        |
    And I click "Save Details"
    Then I should see a success message "Details saved successfully!"
