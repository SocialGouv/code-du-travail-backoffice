Feature: Login
  In order to list my contribution drafts as well as the contributions to do
  As a registered administrator, contributor or validator
  I want to be able to log into the application

  Scenario: Successfully login as an administrator
    Given I am a registered "administrator"
    When I log into the application
    Then I should see the title "Tableau de bord"
    And I should see the subtitle "État d'avancement des réponses"

  Scenario: Successfully login as a contributor
    Given I am a registered "contributor"
    When I log into the application
    Then I should see the subtitle "Réponses à rédiger"
