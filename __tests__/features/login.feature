Feature: Login
  In order to list my contribution drafts as well as the contributions to do
  As a registered administrator, contributor or validator
  I want to be able to log into the application

  Scenario: Successfully login as a administrator
    Given I am a registered administrator
    When I login to the application
    Then I should see "Mes réponses en cours de rédaction"
    And I should see "Réponses à rédiger"

  Scenario: Successfully login as a contributor
    Given I am a registered contributor
    When I login to the application
    Then I should see "Mes réponses en cours de rédaction"
    And I should see "Réponses à rédiger"

  Scenario: Successfully login as a validator
    Given I am a registered validator
    When I login to the application
    Then I should see "Mes réponses en cours de rédaction"
    And I should see "Réponses à rédiger"
