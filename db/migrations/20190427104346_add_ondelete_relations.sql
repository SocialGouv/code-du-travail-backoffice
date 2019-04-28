-------------------------------------- UP --------------------------------------

ALTER TABLE api.locations_agreements
  DROP CONSTRAINT locations_agreements_location_id_fkey,
  ADD CONSTRAINT locations_agreements_location_id_fkey
    FOREIGN KEY (location_id)
    REFERENCES api.locations(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE api.locations_agreements
  DROP CONSTRAINT locations_agreements_agreement_id_fkey,
  ADD CONSTRAINT locations_agreements_agreement_id_fkey
    FOREIGN KEY (agreement_id)
    REFERENCES api.agreements(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE auth.users
  ALTER COLUMN location_id DROP NOT NULL,
  DROP CONSTRAINT users_location_id_fkey,
  ADD CONSTRAINT users_location_id_fkey
    FOREIGN KEY (location_id)
    REFERENCES api.locations(id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION;

ALTER TABLE users_agreements
  DROP CONSTRAINT users_agreements_agreement_id_fkey,
  ADD CONSTRAINT users_agreements_agreement_id_fkey
    FOREIGN KEY (agreement_id)
    REFERENCES api.agreements(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE users_agreements
  DROP CONSTRAINT users_agreements_user_id_fkey,
  ADD CONSTRAINT users_agreements_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE api.answers
  DROP CONSTRAINT answers_parent_id_fkey,
  ADD CONSTRAINT answers_parent_id_fkey
    FOREIGN KEY (parent_id)
    REFERENCES api.answers(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE api.answers
  ALTER COLUMN question_id DROP NOT NULL,
  DROP CONSTRAINT answers_question_id_fkey,
  ADD CONSTRAINT answers_question_id_fkey
    FOREIGN KEY (question_id)
    REFERENCES api.questions(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE api.answers
  DROP CONSTRAINT answers_agreement_id_fkey,
  ADD CONSTRAINT answers_agreement_id_fkey
    FOREIGN KEY (agreement_id)
    REFERENCES api.agreements(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE api.answers
  DROP CONSTRAINT answers_user_id_fkey,
  ADD CONSTRAINT answers_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION;

ALTER TABLE api.questions_tags
  DROP CONSTRAINT questions_tags_question_id_fkey,
  ADD CONSTRAINT questions_tags_question_id_fkey
    FOREIGN KEY (question_id)
    REFERENCES api.questions(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE api.questions_tags
  DROP CONSTRAINT questions_tags_tag_id_fkey,
  ADD CONSTRAINT questions_tags_tag_id_fkey
    FOREIGN KEY (tag_id)
    REFERENCES api.tags(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE api.answers_tags
  DROP CONSTRAINT answers_tags_answer_id_fkey,
  ADD CONSTRAINT answers_tags_answer_id_fkey
    FOREIGN KEY (answer_id)
    REFERENCES api.answers(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

ALTER TABLE api.answers_tags
  DROP CONSTRAINT answers_tags_tag_id_fkey,
  ADD CONSTRAINT answers_tags_tag_id_fkey
    FOREIGN KEY (tag_id)
    REFERENCES api.tags(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION;

------------------------------------- DOWN -------------------------------------

ALTER TABLE api.locations_agreements
  DROP CONSTRAINT locations_agreements_location_id_fkey,
  ADD CONSTRAINT locations_agreements_location_id_fkey
    FOREIGN KEY (location_id)
    REFERENCES api.locations(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE api.locations_agreements
  DROP CONSTRAINT locations_agreements_agreement_id_fkey,
  ADD CONSTRAINT locations_agreements_agreement_id_fkey
    FOREIGN KEY (agreement_id)
    REFERENCES api.agreements(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE auth.users
  DROP CONSTRAINT users_location_id_fkey,
  ADD CONSTRAINT users_location_id_fkey
    FOREIGN KEY (location_id)
    REFERENCES api.locations(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  ALTER COLUMN location_id SET NOT NULL;

ALTER TABLE users_agreements
  DROP CONSTRAINT users_agreements_agreement_id_fkey,
  ADD CONSTRAINT users_agreements_agreement_id_fkey
    FOREIGN KEY (agreement_id)
    REFERENCES api.agreements(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE users_agreements
  DROP CONSTRAINT users_agreements_user_id_fkey,
  ADD CONSTRAINT users_agreements_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE api.answers
  DROP CONSTRAINT answers_parent_id_fkey,
  ADD CONSTRAINT answers_parent_id_fkey
    FOREIGN KEY (parent_id)
    REFERENCES api.answers(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE api.answers
  DROP CONSTRAINT answers_question_id_fkey,
  ADD CONSTRAINT answers_question_id_fkey
    FOREIGN KEY (question_id)
    REFERENCES api.questions(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  ALTER COLUMN question_id SET NOT NULL;

ALTER TABLE api.answers
  DROP CONSTRAINT answers_agreement_id_fkey,
  ADD CONSTRAINT answers_agreement_id_fkey
    FOREIGN KEY (agreement_id)
    REFERENCES api.agreements(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE api.answers
  DROP CONSTRAINT answers_user_id_fkey,
  ADD CONSTRAINT answers_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE api.questions_tags
  DROP CONSTRAINT questions_tags_question_id_fkey,
  ADD CONSTRAINT questions_tags_question_id_fkey
    FOREIGN KEY (question_id)
    REFERENCES api.questions(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE api.questions_tags
  DROP CONSTRAINT questions_tags_tag_id_fkey,
  ADD CONSTRAINT questions_tags_tag_id_fkey
    FOREIGN KEY (tag_id)
    REFERENCES api.tags(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE api.answers_tags
  DROP CONSTRAINT answers_tags_answer_id_fkey,
  ADD CONSTRAINT answers_tags_answer_id_fkey
    FOREIGN KEY (answer_id)
    REFERENCES api.answers(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE api.answers_tags
  DROP CONSTRAINT answers_tags_tag_id_fkey,
  ADD CONSTRAINT answers_tags_tag_id_fkey
    FOREIGN KEY (tag_id)
    REFERENCES api.tags(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
